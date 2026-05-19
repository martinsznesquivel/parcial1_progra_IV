import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Modal {
  public mostrar = signal<boolean>(false);
  public titulo = signal<string>('');
  public mensaje = signal<string>('');

  mostrarError(titulo: string, mensaje: string ){
    this.titulo.set(titulo);
    this.mensaje.set(mensaje)
    this.mostrar.set(true)
  }

  cerrar(){
    this.mostrar.set(false);
  }
}

