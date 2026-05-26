import { Routes } from '@angular/router';
import { Bienvenida } from './components/bienvenida/bienvenida';
import { Login } from './components/login/login';
import { QuienSoy } from './components/quien-soy/quien-soy';
import { Registro } from './components/registro/registro';
import { Ahorcado } from './components/juegos/ahorcado/ahorcado';
import { logueadoGuard } from './guards/logueado-guard';
import { Mayoromenor } from './components/juegos/mayoromenor/mayoromenor';
import { Preguntados } from './components/juegos/preguntados/preguntados';
import { ConquistaGalacticaComponent } from './components/juegos/conquista-galactica/conquista-galactica';

export const routes: Routes = [
    {path: 'bienvenida', component: Bienvenida},
    {path: 'login', component:Login, canActivate: [logueadoGuard]},
    {path: 'registro', component:Registro, canActivate: [logueadoGuard]},
    {path: 'quien-soy', component:QuienSoy},
    {path: 'juegos/ahorcado', component: Ahorcado},
    {path: 'juegos/mayoromenor', component: Mayoromenor},
    {path: 'juegos/preguntados', component: Preguntados},
    {path: 'juegos/conquista', component: ConquistaGalacticaComponent},
    
    // auth guard lo usaría cuando empiece con el chat y los juegos
    {path: '**', redirectTo: '/bienvenida', pathMatch: 'full'}
];
