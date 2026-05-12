import { Component, inject } from '@angular/core';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IRegistro } from '../../interfaces/auth.interfaces';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule], //Importamos ReactiveFormsModule para utilizar FormControl
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  authService = inject(AuthService);

  formulario = new FormGroup({
    // FormGroup para mayor escalabilidad, no itera individualmente variables sueltas, si no al objeto que contiene a todas
    nombre: new FormControl('', {
      validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required],
    }),
    apellido: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99)]),
  });

  accion() {
    if (this.formulario.invalid) return;

    this.formulario.value;
    
    this.authService.registrar(this.formulario.value as IRegistro);
  }

  // prueba en consola
  mostrar() {
    if (!this.formulario.valid) {
      console.log('No valido');
    }
    console.log(this.formulario.value);
  }
}
