import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Modal } from './services/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sala-de-juegos');
  constructor(public authService: AuthService, private router: Router){}
  public modalService = inject(Modal);

  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }
}
