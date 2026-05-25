import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Modal } from './services/modal';
import { Chat } from './components/chat/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sala-de-juegos');
  constructor(public authService: AuthService, private router: Router){}
  public modalService = inject(Modal);
  chatAbierto = false;

  async cerrarSesion() {
    await this.authService.cerrarSesion();
  }
}
