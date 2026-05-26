import { Component, inject } from '@angular/core';
import { ConquistaGalactica } from '../../../services/conquista-galactica';
import { CommonModule } from '@angular/common';
import { Nave } from '../../../models/juego.models';

@Component({
  selector: 'app-conquista-galactica',
  imports: [CommonModule],
  templateUrl: './conquista-galactica.html',
  styleUrl: './conquista-galactica.css',
})
export class ConquistaGalacticaComponent {
  service = inject(ConquistaGalactica);

  //getter que filtra el array completo de naves y devuelve la flota seleccionada por el jugador. Renderiza naves disponibles en combato
  get navesSeleccionadas() {
    return this.service.naves().filter((n) => n.seleccionada);
  }

  //getter que busca el planeta seleccionado para msotrar estadisticas y barra de vista
  get planetaSeleccionado() {
    return this.service.planetas().find((p) => p.seleccionado);
  }

  //getter que devuelve las naves de la flota que aun tienen vida
  get navesVivas() {
    return this.service.naves().filter((n) => n.seleccionada && n.vida > 0);
  }
  
  //delega la accion de disparo de una nave al service de combate
  ejecutarAtaque(nave: Nave) {
    this.service.atacarPlaneta(nave.id);
  }

  //restaura el estado del juego a sus valores por defecto
  //revive naves, planetas, devuelve presupuesto inicial y manda al jugador a la fase de seleccion 
  reiniciarJuego() {
    this.service.naves.update((lista) =>
      lista.map((nave) => ({
        ...nave,
        vida: nave.vidaMax,
        seleccionada: false,
        isCooldown: false,
      })),
    );
    this.service.planetas.update((lista) =>
      lista.map((planeta) => ({
        ...planeta,
        hp: planeta.hpMax,
        conquistado: false,
        seleccionado: false,
      })),
    );
    this.service.presupuestoRestante.set(this.service.presupuestoTotal);
    this.service.faseJuego.set('SELECCION');
  }

  //finaliza la partida por decisionm del jugador (por ejemplo, se queda sin presupuesto o no le alcanza nada)
  //llama al service para guardar las estadisticas en la base de datos y registra una derrota
  async rendirse() {
    await this.service.finalizarPartida(false);
  }
}
