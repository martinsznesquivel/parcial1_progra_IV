import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class Resultados {
  private supabase = inject(SupabaseService).getClient();
  private authService = inject(AuthService);

  //Extrae el nombre de los metadatos, si no existe usa el mail o como ultimo recurso a anonimo
  private getNombreUsuario(): string {
    const user = this.authService.usuarioActual();
    return user?.user_metadata?.['nombre'] ?? user?.email ?? 'Anonimo';
  }

  //Inserta un nuevo registro a la tabla del juego Ahorcado
  async guardarAhorcado(puntaje: number, tiempo: number, letrasSeleccionadas: number, gano: boolean){
    const { error } = await this.supabase.from('partidas_ahorcado').insert({
      usuario: this.getNombreUsuario(),
      puntaje,
      tiempo,
      letras_seleccionadas: letrasSeleccionadas,
      gano
    });

    if (error) throw error;
  }

  //Inserta un nuevo registro a la tabla del juego Mayor o menor
  async guardarMayorMenor(aciertos: number, tiempo: number) {
    const { error } = await this.supabase.from('partidas_mayoromenor').insert({
      usuario: this.getNombreUsuario(),
      aciertos,
      tiempo
    });

    if (error) throw error;
  }

    //Inserta un nuevo registro a la tabla del juego Preguntados
  async guardarPreguntados(aciertos: number){
    const { error } = await this.supabase.from('partidas_preguntados').insert({
      usuario: this.getNombreUsuario(),
      aciertos: aciertos,
      total_preguntas: 10
    });

    if (error) throw error;
  }

  //Inserta un nuevo registro a la tabla de Conquista Galactica. Genera un timestamp iso para registrar de manera exacta la fecha
  async guardarConquista(planetasConquistados: number, presupuestoFinal: number, victoria: boolean){
    const { error } = await this.supabase.from('partidas_conquista').insert({
      usuario: this.getNombreUsuario(),
      planetas_conquistados: planetasConquistados,
      presupuesto_final: presupuestoFinal,
      gano: victoria,
      fecha: new Date().toISOString()
    });

    if (error) throw error;
  }
}
