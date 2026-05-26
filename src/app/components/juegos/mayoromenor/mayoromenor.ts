import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../../interfaces/auth.interfaces';
import { Resultados } from '../../../services/resultados';
import { MayorMenorService } from '../../../services/juegos/mayoromenor/mayoromenor';

@Component({
  selector: 'app-mayoromenor',
  imports: [CommonModule],
  templateUrl: './mayoromenor.html',
  styleUrl: './mayoromenor.css',
})
export class Mayoromenor implements OnInit {
  public juego = inject(MayorMenorService);

  ngOnInit(): void {
    this.juego.iniciarJuego();
  }
}
