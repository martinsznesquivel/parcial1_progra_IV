import { Injectable, inject, computed, signal } from '@angular/core';
import { Resultados } from '../../resultados';

const palabras: string[] = ['TATOOINE', 'VADER', 'KENOBI', 'PLAGUEIS', 'SKYWALKER', 'KAMINO'];

@Injectable({
  providedIn: 'root',
})
export class AhorcadoService {
  private resultados = inject(Resultados);

  palabraSecreta: string = ''; // palabra elegida internamente

  vidasRestantes = signal(6);
  juegoTerminado = signal(false);
  gano = signal(false);
  letrasSeleccionadas = signal<string[]>([]);
  tiempoInicio = signal<number | null>(null);
  tiempoFinal = signal<number | null>(null);

  palabraOculta = signal<string[]>([]); //esta es la que va a ver el usuario, muestra guiones o letras acertadas

  //calcula automaticamente el tiempo total de juego en segundos. Se leen los timestapms de inicio y final
  //computed memoriza valores y evita que angular haga cosas de mas
  calcularTiempoJuego = computed(() => {
    const inicio = this.tiempoInicio();
    const final = this.tiempoFinal();
    if (!inicio || !final) return 0;
    return Math.floor((final - inicio) / 1000);
  });

  //genera automaticamente un puntaje en base a los errores cometidos, sumando bonificaciones por vidas sobrantes y longitud de la palabra
  calcularPuntaje = computed(() => {
    if (!this.gano()) return 0;
    const intentosFallados = 6 - this.vidasRestantes();
    const puntajeBase = 100 - intentosFallados * 10;
    const bonus = this.vidasRestantes() * 5;
    const bonusLargo = this.palabraSecreta.length * 2;
    return puntajeBase + bonus + bonusLargo;
  });

  //resetea las signals a su valor original y selecciona una nueva palabra aleatoria. Se ejecuta al iniciar una partida
  iniciarJuego() {
    const palabraAleatoria = Math.floor(Math.random() * palabras.length); //math.floor porque random puede tirar un numero decimal, lo redondeamos para abajo para no romper el programa al buscar una palabra

    this.palabraSecreta = palabras[palabraAleatoria].toUpperCase();
    this.palabraOculta.set(Array(this.palabraSecreta.length).fill('_'));
    this.vidasRestantes.set(6);
    this.letrasSeleccionadas.set([]);
    this.juegoTerminado.set(false);
    this.gano.set(false);
    this.tiempoInicio.set(Date.now());
    this.tiempoFinal.set(null);
  }

  //procesa el ingreso de una letra clickeada por el usuario
  seleccionarLetra(letra: string) {
    if (this.juegoTerminado() || this.letrasSeleccionadas().includes(letra)) return;

    //copio lo que tenía en el array viejo y agrego la nueva letra al final
    this.letrasSeleccionadas.update((letras) => [...letras, letra]);

    //si la palabra secreta tiene la letra que ingresé, for recorre la palabra secreta en caso de que haya 2 coincidencias. Las que coinciden reemplaza al guion por la letra acertada.
    if (this.palabraSecreta.includes(letra)) {
      this.palabraOculta.update((oculta) => {
        const nueva = [...oculta];
        for (let i = 0; i < this.palabraSecreta.length; i++) {
          if (this.palabraSecreta[i] === letra) {
            nueva[i] = letra;
          }
        }
        return nueva;
      });
    } else {
      this.vidasRestantes.update((v) => v - 1);
    }
    this.verificarEstadoJuego();
  }

  //Evalua las condiciones de victoria (como que no queden guiones) o derrota (vidas en cero)
  //Si la partida termina, congela el tiempo y delega el guardado de estadisticas al service resultados
  verificarEstadoJuego() {
    if (!this.palabraOculta().includes('_')) {
      this.gano.set(true);
      this.juegoTerminado.set(true);
    } else if (this.vidasRestantes() === 0) {
      this.gano.set(false);
      this.juegoTerminado.set(true);
    } else {
      return; //sigue el juego
    }

    this.tiempoFinal.set(Date.now());

    this.resultados.guardarAhorcado(
      this.calcularPuntaje(),
      this.calcularTiempoJuego(),
      this.letrasSeleccionadas().length,
      this.gano(),
    );
  }
}
