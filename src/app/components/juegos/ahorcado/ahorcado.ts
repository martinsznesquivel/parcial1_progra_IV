import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {
  palabras: string[] = ['TATOOINE', 'VADER', 'KENOBI', 'PLAGUEIS', 'SKYWALKER', 'KAMINO'];

  palabraSecreta: string = '';
  palabraOculta = signal<string[]>([]); //esta es la que va a ver el usuario
  vidasRestantes = signal(6);
  juegoTerminado = signal(false);
  gano = signal(false);
  tiempoInicio = signal<number | null>(null)
  tiempoFinal = signal<number | null>(null);

  letrasAbecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letrasSeleccionadas = signal<string[]>([]);

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    const palabraAleatoria = Math.floor(Math.random() * this.palabras.length);
    this.palabraSecreta = this.palabras[palabraAleatoria].toUpperCase();
    
    this.palabraOculta.set(Array(this.palabraSecreta.length).fill('_'));
    this.vidasRestantes.set(6);
    this.letrasSeleccionadas.set([]);
    this.juegoTerminado.set(false);
    this.gano.set(false);
    this.tiempoInicio.set(Date.now());
    this.tiempoFinal.set(null); 

    console.log('Palabra a adivinar: ', this.palabraSecreta); //Debug
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado() || this.letrasSeleccionadas().includes(letra)) {
      return;
    }

    this.letrasSeleccionadas.update(letras => [...letras, letra]);

    if (this.palabraSecreta.includes(letra)) {
      this.palabraOculta.update(oculta => {
        const nueva = [...oculta];
        for(let i = 0; i < this.palabraSecreta.length; i++){
          if (this.palabraSecreta[i] === letra){
            nueva[i] = letra;
          }
        }
        return nueva;
      });
        } else {
          this.vidasRestantes.update(v => v - 1);
        }
        this.verificarEstadoJuego();
      }

  verificarEstadoJuego() {
    if (!this.palabraOculta().includes('_')) {
      this.gano.set(true);
      this.juegoTerminado.set(true);
      this.tiempoFinal.set(Date.now());
    } else if (this.vidasRestantes() === 0) {
      this.gano.set(false);
      this.juegoTerminado.set(true);
    }
    this.tiempoFinal.set(Date.now());
  }

  calcularTiempoJuego = computed(()=> {
    const inicio = this.tiempoInicio();
    const final = this.tiempoFinal();
    if (!inicio || !final) return 0;
      return Math.floor((final - inicio) / 1000);
    });

    calcularPuntaje = computed(()=> {
      if(!this.gano) return 0;
      const intentosFallados = 6 - this.vidasRestantes();
      const puntajeBase = 100 - (intentosFallados * 10);
      const bonus = this.vidasRestantes() * 5;
      const bonusLargo = this.palabraSecreta.length * 2;
      return puntajeBase + bonus + bonusLargo; 
    });
}
