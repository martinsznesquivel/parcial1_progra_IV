import { Injectable, OnInit } from "@angular/core";
import { createClient, SupabaseClient, AuthResponse } from "@supabase/supabase-js";
import { ILogin, IRegistro } from "../interfaces/auth.interfaces";

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    supabaseUrl = 'https://quhhjhyizyhapaqalhub.supabase.co'
    
    publishableKey = 'sb_publishable_jlll8u8H3sIR2DAP1lOaSg_Nd1ZNBmJ'
    
    supabase: SupabaseClient<any, 'public', 'public', any, any>;
    
    usuarioActual: any;
    
    constructor() {
        this.supabase = createClient(this.supabaseUrl, this.publishableKey)
        
    }

    async registrar(datos : IRegistro) : Promise<void>{
        const response: AuthResponse = await this.supabase?.auth.signUp({
            email: datos.email,
            password: datos.password,
            options: {
                data: {
                    nombre: datos.nombre,
                },
            },
        });

        if (response.error) {
            console.log(response.error);
        }
        {
            console.log(response.data)
        }
    }

        login({ email, password } : ILogin){

    }

}