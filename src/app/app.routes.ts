import { Routes } from '@angular/router';
import { Bienvenida } from './components/bienvenida/bienvenida';
import { Login } from './components/login/login';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Registro } from './components/registro/registro';

export const routes: Routes = [
    {path: 'bienvenida', component: Bienvenida},
    {path: 'login', component:Login},
    {path: 'registro', component:Registro},
    {path: 'quien-soy', component:QuienSoy},
    {path: '', redirectTo: '/bienvenida', pathMatch: 'full'}
];
