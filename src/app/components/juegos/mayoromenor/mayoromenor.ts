import { Component, computed, OnInit, signal, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../../interfaces/auth.interfaces';
import { Resultados } from '../../../services/resultados';

@Component({
  selector: 'app-mayoromenor',
  imports: [CommonModule],
  templateUrl: './mayoromenor.html',
  styleUrl: './mayoromenor.css',
})
export class Mayoromenor implements OnInit{

  private resultados = inject(Resultados);

  palos = ['bastos', 'copas', 'espadas', 'oros']

  baraja: Carta[] = [];
  cartaActual = signal<Carta | null>(null);
  cartaSiguiente = signal<Carta | null>(null);
  indice = signal(0);

  aciertos = signal(0);
  juegoTerminado = signal(false);
  resultado = signal<'correcto' | 'incorrecto' | null>(null);
  tiempoInicio = signal<number | null>(null);
  tiempoFinal = signal<number | null>(null);

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(){
    this.baraja = this.mezclar(this.generarBaraja());
    this.indice.set(0);
    this.aciertos.set(0);
    this.juegoTerminado.set(false);
    this.resultado.set(null);
    this.tiempoInicio.set(Date.now());
    this.tiempoFinal.set(null);
    this.cartaActual.set(this.baraja[0]);
    this.cartaSiguiente.set(this.baraja[1]);
  }

  generarBaraja(): Carta[]{
    const cartas: Carta[] = [];
    for(const palo of this.palos){
      for(let numero = 1; numero <= 12; numero++){
        cartas.push({numero, palo});
      }
    }
    return cartas;
  }

  mezclar(cartas: Carta[]): Carta[] {
    return[...cartas].sort(()=> Math.random() - 0.5);
  }

  getUrlCarta(carta : Carta): string {
    return `https://raw.githubusercontent.com/mcmd/playingcards.io-spanish.playing.cards/master/img/${carta.numero.toString().padStart(2, '0')}-${carta.palo}.png`;
  }

  elegir(eleccion: 'mayor' | 'menor') {
    if (this.juegoTerminado() || !this.cartaActual() || !this.cartaSiguiente()) return;

    const actual = this.cartaActual()!.numero;
    const siguiente = this.cartaSiguiente()!.numero;

    const esCorrecta = 
    (eleccion === 'mayor' && siguiente > actual) ||
    (eleccion === 'menor' && siguiente < actual);

    if (esCorrecta){
      this.aciertos.update(a => a + 1);
      this.resultado.set('correcto');
    } else {
      this.resultado.set('incorrecto');
      this.tiempoFinal.set(Date.now());
      this.juegoTerminado.set(true);
      this.resultados.guardarMayorMenor(this.aciertos(), this.tiempoDeJuego())
      return;
    }

    const nuevoIndice = this.indice() + 1;
    this.indice.set(nuevoIndice);

    if(nuevoIndice + 1 >= this.baraja.length){
      this.tiempoFinal.set(Date.now());
      this.juegoTerminado.set(true);
      this.resultados.guardarMayorMenor(this.aciertos(), this.tiempoDeJuego());
      return;
    }

    this.cartaActual.set(this.baraja[nuevoIndice]);
    this.cartaSiguiente.set(this.baraja[nuevoIndice + 1]);
  }

  tiempoDeJuego = computed(()=> {
    const inicio = this.tiempoInicio();
    const final = this.tiempoFinal();
    if (!inicio || !final) return 0;
    return Math.floor((final - inicio) / 1000);
  });
}
