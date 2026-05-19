import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const logueadoGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const { data :{ session } } = await authService.supabase.auth.getSession();

  if (authService.usuarioActual()) {
    router.navigateByUrl('/bienvenida');
    return false;
  }
  return true;
};
