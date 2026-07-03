import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            {
                path: '', 
                loadComponent: () => import('./features/public/landing/landing.component').then(c => c.LandingComponent)
            },
            {
                path: 'signin',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
            },
            {
                path: 'signup',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
            }
        ]

    },

    {
        path: 'app',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            {
                path: '',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
            }
        ]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
