import { inject, Injectable, OnInit, signal } from '@angular/core';
import { createClient, SupabaseClient, AuthResponse, User, UserResponse } from '@supabase/supabase-js';
import { ILogin, IRegistro } from '../interfaces/auth.interfaces';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ;

  private supabaseService = inject(SupabaseService);
  public supabase : SupabaseClient = this.supabaseService.getClient();

  usuarioActual  = signal<User | null>(null);

  constructor() {

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
