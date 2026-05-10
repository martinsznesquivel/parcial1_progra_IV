import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class Github {
    http = inject(HttpClient);
    usuario = 'martinsznesquivel';
    apiGithub = 'https://api.github.com/users/'
    usuarioGithub = signal<any | null>(null)

    obtenerUsuarioGithub(){
        const peticion = this.http.get<any>(this.apiGithub + this.usuario)

        const suscripcion = peticion.subscribe((data) => {
            if(data){
                this.usuarioGithub.set(data);
            }

            suscripcion.unsubscribe();
        })
    }
}