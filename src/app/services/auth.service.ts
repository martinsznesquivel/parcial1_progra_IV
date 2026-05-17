import { inject, Injectable, OnInit, signal } from '@angular/core';
import { createClient, SupabaseClient, AuthResponse, User, UserResponse } from '@supabase/supabase-js';
import { ILogin, IRegistro } from '../interfaces/auth.interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabaseUrl = 'https://quhhjhyizyhapaqalhub.supabase.co';

  publishableKey = 'sb_publishable_jlll8u8H3sIR2DAP1lOaSg_Nd1ZNBmJ';

  supabase: SupabaseClient<any, 'public', 'public', any, any>;

  usuarioActual  = signal<User | null>(null);

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.publishableKey);

    this.supabase.auth.onAuthStateChange((event, session) => {
        if(session?.user){
            this.usuarioActual.set(session.user);
        } else {
            this.usuarioActual.set(null);
        }
    });
  }

  async registrar(datos: IRegistro): Promise<void> {
    const { data, error } = await this.supabase?.auth.signUp({
      email: datos.email,
      password: datos.password,
      options: {
        data: {
          nombre: datos.nombre,
        },
      },
    });

    if(error){
      throw error;
    }
  }

  async login({ email, password }: ILogin): Promise<void> {
    const { data, error } = await this.supabase?.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw error;
    }
      this.usuarioActual.set(data.user);
      this.router.navigateByUrl('/bienvenida')
  }

  router = inject(Router)

  cerrarSesion() {
    this.supabase.auth.signOut();
    this.usuarioActual.set(null);
    this.router.navigateByUrl('/login')
  }
}
