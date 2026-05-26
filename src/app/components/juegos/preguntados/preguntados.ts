import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Trivia, PreguntaTrivia } from '../../../services/trivia';
import { Resultados } from '../../../services/resultados';

interface Pregunta {
  texto: string;
  opciones: string[];
  respuestaCorrecta: string;
}

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {
  private servicioTrivia = inject(Trivia);
  private servicioResultados = inject(Resultados);

  preguntas = signal<Pregunta[]>([]);
  indiceActual = signal(0);
  aciertos = signal(0);
  cargando = signal(true);
  juegoTerminado = signal(false);

  //signal computada que devuelve la pregunta actual en base al indice. Se actualiza cuando el jugador pasa de ronda
  preguntaActual = computed(() => {
    const lista = this.preguntas();
    const indice = this.indiceActual();
    return lista.length > 0 ? lista[indice] : null;
  });

  async ngOnInit() {
    await this.prepararJuego();
  }

  //inicia el juego. Resetea estados, consume la api y mapea resultados. Mezcla las respuestas 
  async prepararJuego() {
    try {
      this.cargando.set(true);
      this.indiceActual.set(0);
      this.aciertos.set(0);
      this.juegoTerminado.set(false);

      const datos = await this.servicioTrivia.obtenerPreguntas();

      const preguntasMapeadas: Pregunta[] = datos.results.map((res: PreguntaTrivia) => {
        const opcionesMezcladas = [res.correct_answer, ...res.incorrect_answers].sort(
          () => Math.random() - 0.5,
        );

        return {
          texto: res.question,
          opciones: opcionesMezcladas,
          respuestaCorrecta: res.correct_answer,
        };
      });

      this.preguntas.set(preguntasMapeadas);
      this.cargando.set(false);
    } catch (error) {
      console.error('Error conectando con la api de trivia', error);
      this.cargando.set(false);
    }
  }

  // Evalua la opcion escogida por el usuario. Si es correcta, suma un acierto y pasa al siguiente indice o finaliza el juego si respondió las 10 preguntas
  // Guarda el resultado final
  async elegirOpcion(opcionSeleccionada: string) {
    if (this.juegoTerminado() || this.cargando()) return;

    const correcta = this.preguntaActual()?.respuestaCorrecta;

    if (opcionSeleccionada === correcta) {
      this.aciertos.update((a) => a + 1);
    }

    const siguienteIndice = this.indiceActual() + 1;

    //Controla que la partida finalice despues de 10 preguntas
    if (siguienteIndice >= 10) {
      this.juegoTerminado.set(true);

      try {
        await this.servicioResultados.guardarPreguntados(this.aciertos());
        console.log('Partida guardada con exito en supabase');
      } catch (err) {
        console.error('Error al guardar partida en supabase', err);
      }
    } else {
      this.indiceActual.set(siguienteIndice);
    }
  }
}
