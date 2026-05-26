import { Injectable, signal, computed, inject } from '@angular/core';
import { Nave, Planeta } from '../../../models/juego.models';
import { Resultados } from '../../resultados';

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
      imagen: 'juegos/conquista/bombardero.png',
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

  //signals computadas para manejar estados

  victoriaTotal = computed(() => this.planetas().every((p) => p.conquistado));

  puedeJugar = computed(() => {
    return this.naves().some((n) => n.vida > 0 && n.costo <= this.presupuestoRestante());
  });

  navesSeleccionadas = computed(() => {
    return this.naves().filter((n) => n.seleccionada);
  });

  planetaSeleccionado = computed(() => {
    return this.planetas().find((p) => p.seleccionado);
  });

  navesVivas = computed(() => {
    return this.naves().filter((n) => n.seleccionada && n.vida > 0);
  });

  // Metodos

  //alterna el estado de las naves "seleccionada" evaluando el presupuseto disponible.
  //Si se selecciona, descuenta el costo. Si se deselecciona, reintegra el costo al presupuesto
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

  //marca un planeta como el objetivo actual. Solo puede haber un planeta seleccionado a la vez
  seleccionarPlaneta(planetaId: number) {
    this.planetas.update((lista) =>
      lista.map((planeta) => ({
        ...planeta,
        seleccionado: planeta.id === planetaId,
      })),
    );
  }

  //Valida que haya un objetivo y flota seleccionada antes de cambiar de fase
  //Si no hay naves seleccionadas, evalua si el jugador tiene suficientes fondos para comprar
  //Si no tiene presupuesto suficiente, pierde y salta la pantalla de derrota
  iniciarCombate() {
    const hayPlaneta = this.planetas().some((p) => p.seleccionado);
    const hayNaves = this.naves().some((n) => n.seleccionada);

    if (hayPlaneta && hayNaves) {
      this.faseJuego.set('COMBATE');
    } else if (hayPlaneta && !hayNaves) {
      const puedeComprarAlgo = this.naves().some(
        (n) => n.vida > 0 && n.costo <= this.presupuestoRestante(),
      );
      if (!puedeComprarAlgo) {
        this.finalizarPartida(false);
      }
    }
  }

  //calcula el exito del ataque basado en la estadistica de defensa del planeta versus un roll aletorio por rng.
  //gestiona daño infligido o recibido y evalua condiciones post ataque (si se conquistó el planeta, si se destruyó la flota o la victoria total)
  async atacarPlaneta(naveId: number) {
    const nave = this.naves().find((n) => n.id === naveId);
    const planeta = this.planetas().find((p) => p.seleccionado);

    if (!nave || !planeta || !nave.seleccionada || nave.vida <= 0) return;

    const probabilidad = Math.random() * 100;

    //Si el numero aleatorio es mayor que la defensa del planeta, el ataque falla y la nave recibe daño
    if (probabilidad < planeta.defensa) {
      //El planeta repele el ataque
      this.naves.update((lista) =>
        lista.map((n) =>
          n.id === naveId ? { ...n, vida: Math.max(0, n.vida - nave.ataqueBase / 2) } : n,
        ),
      );
    } else {
      // si el ataque tiene exito, el planeta recibe daño igual al ataque base de la nave
      this.planetas.update((planetas) =>
        planetas.map((p) =>
          p.seleccionado ? { ...p, hp: Math.max(0, p.hp - nave.ataqueBase) } : p,
        ),
      );
    }

    const planetaActualizado = this.planetas().find((p) => p.seleccionado);

    if (planetaActualizado && planetaActualizado.hp <= 0) {
      //si el planeta queda sin hp marcamos el planeta como conquistado
      this.planetas.update((lista) =>
        lista.map((p) => (p.seleccionado ? { ...p, conquistado: true, seleccionado: false } : p)),
      );

      if (this.victoriaTotal()) {
        await this.finalizarPartida(true);
      } else {
        this.faseJuego.set('SELECCION'); //vuelve a la pantalla de seleccion para el siguiente planeta
      }
      return;
    }

    //Verificar derrota si las naves seleccionadas murieron
    const navesVivas = this.naves().filter((n) => n.seleccionada && n.vida > 0);
    if (navesVivas.length === 0) {
      this.naves.update((lista) =>
        lista.map((nave) => (nave.vida <= 0 ? { ...nave, seleccionada: false } : nave)),
      );

      //Chequea gameover total (todas las naves fueron destruidas)
      const navesDisponibles = this.naves().filter((n) => n.vida > 0);
      if (navesDisponibles.length === 0) {
        await this.finalizarPartida(false);
      } else {
        this.faseJuego.set('SELECCION');
      }
    }
  }

  //termina el juego, establece la vista final y envia parametros de rendimiento a la base de datos a traves del service Resultados
  async finalizarPartida(victoria: boolean) {
    this.faseJuego.set(victoria ? 'VICTORIA' : 'DERROTA');
    await this.resultados.guardarConquista(
      this.planetas().filter((p) => p.conquistado).length,
      this.presupuestoRestante(),
      victoria,
    );
  }

  //restaura el estado del juego a sus valores por defecto
  //revive naves, planetas, devuelve presupuesto inicial y manda al jugador a la fase de seleccion
  reiniciarJuego() {
    this.naves.update((lista) =>
      lista.map((nave) => ({
        ...nave,
        vida: nave.vidaMax,
        seleccionada: false,
        isCooldown: false,
      })),
    );
    this.planetas.update((lista) =>
      lista.map((planeta) => ({
        ...planeta,
        hp: planeta.hpMax,
        conquistado: false,
        seleccionado: false,
      })),
    );
    this.presupuestoRestante.set(this.presupuestoTotal);
    this.faseJuego.set('SELECCION');
  }
}
