import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth.service';

interface Mensaje {
  id: string;
  usuario: string;
  contenido: string;
  created_at: string;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  private supabase = inject(SupabaseService).getClient();
  private authService = inject(AuthService);

  //estado reactivo que almacena la lista completa de mensajes a mostrar
  mensajes = signal<Mensaje[]>([]);
  nombreUsuario = '';
  nuevoMensaje = '';
  private canal: any;

  async ngOnInit() {
    const user = this.authService.usuarioActual();
    this.nombreUsuario = user?.user_metadata?.['nombre'] ?? user?.email ?? 'anonimo'
    await this.cargarMensajes();
    this.escucharMensajes();
  }

  //Limpia la suscripcion al canal de supabase cuando el usuario sale de la vista del chat
  //evita fugas de memoria y consumo innecesario de conexiones
  ngOnDestroy() {
    if (this.canal){
      this.supabase.removeChannel(this.canal);
    }
  }

  //Consulta a la tabla 'mensajes' y trae el historial ordenado de mensajes mas antiguo a mas reciente
  async cargarMensajes(){
    const { data, error } = await this.supabase.from('mensajes').select('*').order('created_at', {ascending: true});

    if(!error && data){
      this.mensajes.set(data);
    }
  }

  //con supabase realtime se suscribe a los eventos insert de la tabla mensajes
  //cuando un usuario envia un mensaje, actualiza la signal agregandolo al array
  escucharMensajes(){
    this.canal = this.supabase
    .channel('mensajes')
    .on('postgres_changes',
       {event: 'INSERT', schema: 'public', table: 'mensajes' },
       (payload) => {
        this.mensajes.update(msj => [...msj, payload.new as Mensaje]);
      }
    ).subscribe();
  }

  //inserta un nuevo mensaje en la base de datos
  //realtime ya detecta el insert y actualiza la signal
  async enviarMensaje(){
    if (!this.nuevoMensaje.trim()) return;

    const { error } = await this.supabase.from('mensajes').insert({
      usuario: this.nombreUsuario,
      contenido: this.nuevoMensaje.trim()
    });

    if (!error){
      this.nuevoMensaje = '';
    }
  }

  
}
