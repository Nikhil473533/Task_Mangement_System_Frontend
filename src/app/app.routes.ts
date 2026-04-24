import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    // Public Routes
    {
        path: 'login',
        loadComponent: () =>
            import('./Features/auth/login/login')
                .then(m => m.Login)
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import('./Features/forgot-password/forgot-password')
                .then(m => m.ForgotPassword)
    },

    // Protected Routes
    {
        path: '',
        loadComponent: () =>
            import('./layout/app-layout/app-layout')
                .then(m => m.AppLayout)
        , canActivateChild: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./Features/dashboard/dashboard.component/dashboard.component')
                        .then(m => m.DashboardComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
        ]
    },

    //Fallback
    {
        path: '**',
        redirectTo: 'login'
    }
];
