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

  ngOnDestroy() {
    if (this.canal){
      this.supabase.removeChannel(this.canal);
    }
  }

  async cargarMensajes(){
    const { data, error } = await this.supabase.from('mensajes').select('*').order('created_at', {ascending: true});

    if(!error && data){
      this.mensajes.set(data);
    }
  }

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
