import { Component, inject } from '@angular/core';
import { ConquistaGalactica } from '../../../services/juegos/conquistagalactica/conquista-galactica';
import { CommonModule } from '@angular/common';
import { Nave } from '../../../models/juego.models';

@Component({
  selector: 'app-conquista-galactica',
  imports: [CommonModule],
  templateUrl: './conquista-galactica.html',
  styleUrl: './conquista-galactica.css',
})
export class ConquistaGalacticaComponent {
  public juego = inject(ConquistaGalactica);

}
