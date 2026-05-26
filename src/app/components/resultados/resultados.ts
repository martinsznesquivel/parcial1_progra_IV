import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit{
  private supabase = inject(SupabaseService).getClient();

  ahorcado = signal<any[]>([]);
  mayorMenor = signal<any[]>([]);
  preguntados = signal<any[]>([]);
  conquista = signal<any[]>([]);

  async ngOnInit() {
    await Promise.all([
      this.cargarAhorcado(),
      this.cargarMayorMenor(),
      this.cargarPreguntados(),
      this.cargarConquista(),
    ]);
  }

  async cargarAhorcado(){
    const { data } = await this.supabase.from('partidas_ahorcado').select('*').order('puntaje', {ascending: false});
    if (data) this.ahorcado.set(data)
  }
  
  async cargarMayorMenor(){
    const { data } = await this.supabase.from('partidas_mayoromenor').select('*').order('aciertos', {ascending: false});
    if (data) this.mayorMenor.set(data)
  }
  
  async cargarPreguntados (){
    const { data } = await this.supabase.from('partidas_preguntados').select('*').order('aciertos', {ascending: false});
    if (data) this.preguntados.set(data);
  }
  
  async cargarConquista(){
    const { data } = await this.supabase.from('partidas_conquista').select('*').order('planetas_conquistados', { ascending: false});
    if (data) this.conquista.set(data);
  }
}
