import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { GitHubUser } from "../models/models";

@Injectable({
    providedIn: 'root',
})

export class Github {
    http = inject(HttpClient);
    usuario = 'martinsznesquivel';
    apiGithub = 'https://api.github.com/users/'
    usuarioGithub = signal<GitHubUser | null>(null)
    //Signal que almacena los datos del usuario de github. Se inicializa en null hasta que se resuelva la peticion http

    //Realiza una peticion get a la api de github para obtener los datos del perfil
    //Cuando recibe una respuesta actualiza la signal de usuarioGithub
    obtenerUsuarioGithub(){
        const peticion = this.http.get<any>(this.apiGithub + this.usuario)

        const suscripcion = peticion.subscribe((data) => {
            if(data){
                this.usuarioGithub.set(data);
            }
            //Nos desuscribimos manualmente por si acaso
            suscripcion.unsubscribe();
        })
    }
}