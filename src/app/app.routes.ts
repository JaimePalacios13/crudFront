import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ListadoSolicitudesComponent } from './components/listado-solicitudes/listado-solicitudes.component';
import { PrincipalComponent } from './components/principal/principal.component';

export const routes: Routes = [
    {
        path:'',
        pathMatch: 'full',
        redirectTo:'/principal'
    },
    {
        path: 'principal',
        component: PrincipalComponent
    },
    {
        path: 'solicitud/cliente/:id',
        component: ListadoSolicitudesComponent
    }
];
