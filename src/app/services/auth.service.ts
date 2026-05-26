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
  router = inject(Router)

  //signal que contiene los datos del usuario logueado o null si no hay sesion activa
  //cualquier componente que dependa de esto se actualiza automaticamente por ser una signal
  usuarioActual  = signal<User | null>(null);


  //inicializa un listener de supabase. Si la sesion expira, se recarga la pagina o inicia sesion, usuarioActual se sincroniza automaticamente en tiempo real
  constructor() {

    this.supabase.auth.onAuthStateChange((event, session) => {
        if(session?.user){
            this.usuarioActual.set(session.user);
        } else {
            this.usuarioActual.set(null);
        }
    });
  }

  //registra un usuario en la base de supabase
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

  //inicia sesion con credenciales. Si el login es exitoso actualiza el estado local y redirige al usuario a la pantalla principal
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

  //destruye la sesion actual en supabase, limpia el estado reactivo y manda al usuario de vuelta al login
  cerrarSesion() {
    this.supabase.auth.signOut();
    this.usuarioActual.set(null);
    this.router.navigateByUrl('/login')
  }
}
