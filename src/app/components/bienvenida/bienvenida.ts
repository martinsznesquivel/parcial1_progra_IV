import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

  private auth = inject(AuthService)
  public estaLogueado = computed(()=> this.auth.usuarioActual() !== null);

  public nombreUsuario = computed(()=> {
    const user = this.auth.usuarioActual();
    return user?.user_metadata?.['nombre'] || '';
  });

  constructor() {}

}
