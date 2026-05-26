import { Injectable, signal, computed, inject } from '@angular/core';
import { Nave, Planeta } from '../models/juego.models';
import { Resultados } from './resultados';

@Injectable({
  providedIn: 'root',
})
export class ConquistaGalactica {
  private resultados = inject(Resultados);

  faseJuego = signal<'SELECCION' | 'COMBATE' | 'VICTORIA' | 'DERROTA'>('SELECCION');

  presupuestoTotal = 15;
  presupuestoRestante = signal(15);

  naves = signal<Nave[]>([
    {
      id: 1,
      nombre: 'Caza TIE',
      imagen: 'juegos/conquista/caza.png',
      costo: 1,
      ataqueBase: 5,
      vida: 20,
      vidaMax: 20,
      isCooldown: false,
      seleccionada: false,
    },
    {
      id: 2,
      nombre: 'Interceptor TIE',
      imagen: 'juegos/conquista/interceptor.png',
      costo: 3,
      ataqueBase: 12,
      vida: 40,
      vidaMax: 40,
      isCooldown: false,
      seleccionada: false,
    },
    {
      id: 3,
      nombre: 'Bombardero',
      imagen : 'juegos/conquista/bombardero.png',
      costo: 7,
      ataqueBase: 25,
      vida: 80,
      vidaMax: 80,
      isCooldown: false,
      seleccionada: false,
    },
    {
      id: 4,
      nombre: 'Destructor',
      imagen: 'juegos/conquista/destructor.png',
      costo: 9,
      ataqueBase: 50,
      vida: 150,
      vidaMax: 150,
      isCooldown: false,
      seleccionada: false,
    },
  ]);

  planetas = signal<Planeta[]>([
    {
      id: 1,
      nombre: 'Tatooine',
      imagen: 'juegos/conquista/tatooine.png',
      hp: 100,
      hpMax: 100,
      defensa: 20,
      conquistado: false,
      seleccionado: false,
    },
    {
      id: 2,
      nombre: 'Hoth',
      imagen: 'juegos/conquista/hoth',
      hp: 150,
      hpMax: 150,
      defensa: 35,
      conquistado: false,
      seleccionado: false,
    },
    {
      id: 3,
      nombre: 'Coruscant',
      imagen: 'juegos/conquista/coruscant',
      hp: 250,
      hpMax: 250,
      defensa: 50,
      conquistado: false,
      seleccionado: false,
    },
  ]);

  victoriaTotal = computed(() => this.planetas().every((p) => p.conquistado));

  seleccionarNave(naveId: number) {
    this.naves.update((lista) =>
      lista.map((nave) => {
        if (nave.id === naveId && nave.vida > 0) {
          const nuevaSeleccion = !nave.seleccionada;

          if (nuevaSeleccion && this.presupuestoRestante() >= nave.costo) {
            this.presupuestoRestante.update((p) => p - nave.costo);
            return { ...nave, seleccionada: true };
          } else if (!nuevaSeleccion) {
            this.presupuestoRestante.update((p) => p + nave.costo);
            return { ...nave, seleccionada: false };
          }
        }
        return nave;
      }),
    );
  }

  seleccionarPlaneta(planetaId: number) {
    this.planetas.update((lista) =>
      lista.map((planeta) => ({
        ...planeta,
        seleccionado: planeta.id === planetaId,
      })),
    );
  }

  iniciarCombate() {
    const hayPlaneta = this.planetas().some((p) => p.seleccionado);
    const hayNaves = this.naves().some((n) => n.seleccionada);

    if (hayPlaneta && hayNaves) {
      this.faseJuego.set('COMBATE');
    } else if (hayPlaneta && !hayNaves){
      const puedeComprarAlgo = this.naves().some(n => n.vida > 0 && n.costo <= this.presupuestoRestante());
      if (!puedeComprarAlgo){
        this.finalizarPartida(false);
      }
    }
  }

  async atacarPlaneta(naveId: number) {
    const nave = this.naves().find((n) => n.id === naveId);
    const planeta = this.planetas().find((p) => p.seleccionado);

    if (!nave || !planeta || !nave.seleccionada || nave.vida <= 0) return;
  
    const probabilidad = Math.random() * 100;
    
    //Para hacer daño
    if (probabilidad < planeta.defensa) {
      //El planeta repele el ataque
      this.naves.update((lista) => lista.map((n) =>
          n.id === naveId ? { ...n, vida: Math.max(0, n.vida - nave.ataqueBase / 2) } : n
      ));
    } else {
      // si el ataque es exitoso
      this.planetas.update((planetas) => planetas.map((p) =>
          p.seleccionado ? { ...p, hp: Math.max(0, p.hp - nave.ataqueBase) } : p
        ));
    }

    const navesActualizadas = this.naves();
    const planetaActualizado = this.planetas().find((p) => p.seleccionado);

    if (planetaActualizado && planetaActualizado.hp <= 0) {
      //Marcamos el planeta como conquistado
      this.planetas.update((lista) => lista.map((p) =>
        p.seleccionado ? { ...p, conquistado: true, seleccionado: false } : p,
      ));

      if (this.victoriaTotal()) {
        await this.finalizarPartida(true);
      } else {
        this.faseJuego.set('SELECCION');
      }
      return;
      //Volvemos a la pantalla de seleccion
    }

    //Verificar derrota si el planeta no cayó
    const navesVivas = this.naves().filter((n) => n.seleccionada && n.vida > 0);
    if (navesVivas.length === 0) {
      this.naves.update(lista => lista.map(nave => 
        nave.vida <= 0 ? {...nave, seleccionada: false } : nave
      ));

      const navesDisponibles = this.naves().filter(n => n.vida > 0);
      if(navesDisponibles.length === 0){
        await this.finalizarPartida(false);
      } else {
        this.faseJuego.set('SELECCION')
      }
    }
  }

  async finalizarPartida(victoria: boolean) {
    this.faseJuego.set(victoria ? 'VICTORIA' : 'DERROTA');
    await this.resultados.guardarConquista(
      this.planetas().filter((p) => p.conquistado).length,
      this.presupuestoRestante(),
      victoria,
    );
  }

  puedeJugar = computed(() => {
  return this.naves().some(n => n.vida > 0 && n.costo <= this.presupuestoRestante());
});
}
