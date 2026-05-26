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

  //se ejecuta al inicializar el componente
  //utiliza promise.all para ejecutar las 4 consultas a la base de datos de forma paralela asi ninguna frena a la otra
  async ngOnInit() {
    await Promise.all([
      this.cargarAhorcado(),
      this.cargarMayorMenor(),
      this.cargarPreguntados(),
      this.cargarConquista(),
    ]);
  }

  //obtiene las partidas del ahorcado y ordena por puntaje de mayor a menor
  async cargarAhorcado(){
    const { data } = await this.supabase.from('partidas_ahorcado').select('*').order('puntaje', {ascending: false});
    if (data) this.ahorcado.set(data)
  }
  
  //obtiene las partidas del Mayor o Menor y ordena por aciertos de mayor a menor
  async cargarMayorMenor(){
    const { data } = await this.supabase.from('partidas_mayoromenor').select('*').order('aciertos', {ascending: false});
    if (data) this.mayorMenor.set(data)
  }
  
  //obtiene las partidas del preguntados y ordena por aciertos de mayor a menor
  async cargarPreguntados (){
    const { data } = await this.supabase.from('partidas_preguntados').select('*').order('aciertos', {ascending: false});
    if (data) this.preguntados.set(data);
  }
  
  //obtiene las partidas del Conquista Galactica y ordena por la cantidad de planetas conquistados de mayor a menor
  async cargarConquista(){
    const { data } = await this.supabase.from('partidas_conquista').select('*').order('planetas_conquistados', { ascending: false});
    if (data) this.conquista.set(data);
  }
}
