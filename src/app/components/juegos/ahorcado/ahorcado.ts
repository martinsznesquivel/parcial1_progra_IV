import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Resultados } from '../../../services/resultados';
import { AhorcadoService } from '../../../services/juegos/ahorcado/ahorcado';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {
  public juego = inject(AhorcadoService);

  letrasAbecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

  ngOnInit(): void {
    this.juego.iniciarJuego();
  }
}
