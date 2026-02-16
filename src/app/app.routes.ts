import { Routes } from '@angular/router';
import { Login } from './Features/auth/login/login';
import { authGuard } from './core/guards/auth-guard'; 

export const routes: Routes = [

    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./Features/dashboard/dashboard.component/dashboard.component')   
            .then(m => m.DashboardComponent)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];
