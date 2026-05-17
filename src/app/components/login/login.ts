import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ILogin } from '../../interfaces/auth.interfaces';
import { Modal } from '../../services/modal';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  modalService = inject(Modal);

  formulario = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async accion() {
    if (this.formulario.invalid) return;

    try {
      await this.authService.login(this.formulario.value as ILogin);
    } catch (error: any) {
      console.error('Error capturado en el login: ', error);

      if (error.status === 400 || error.message?.includes('credentials')) {
        this.modalService.mostrarError(
          'No se pudo iniciar sesion',
          'El correo o contraseña son incorrectas',
        );
      } else {
        this.modalService.mostrarError('Error', 'Ocurrio un error inesperado');
      }
    }
  }
}
