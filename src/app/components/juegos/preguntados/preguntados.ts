import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Trivia } from '../../../services/juegos/preguntados/trivia';
@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit {
  public juego = inject(Trivia);

  async ngOnInit() {
    await this.juego.prepararJuego();
  }
}
