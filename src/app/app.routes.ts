import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { PurchaseRequestComponent } from './features/procurement/purchase-request/purchase-request.component';

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
                { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                {
                    path: 'dashboard',
                    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
                },
                {
                    path: 'prq',
                    loadComponent: () => import('./features/procurement/purchase-request/purchase-request.component').then(c => c.PurchaseRequestComponent)
                },
                {
                    path: 'purchase-orders',
                    loadComponent: () => import('./features/procurement/purchase-order/purchase-order.component').then(c => c.PurchaseOrderComponent)
                },
                {
                    path: 'vendors',
                    loadComponent: () => import('./features/procurement/vendor/vendor.component').then(c => c.VendorComponent)
                },
                {
                path: 'admin',
                children: [
                    { path: '', redirectTo: 'users', pathMatch: 'full' },
                    {
                        path: 'users',
                        loadComponent: () => import('./features/admin/user-management/user-management.component').then(c => c.UserManagementComponent)
                    },
                    {
                        path: 'roles',
                        loadComponent: () => import('./features/admin/role-management/role-management.component').then(c => c.RoleManagementComponent)
                    }
                    ]
                }
            ]
        },

        {
            path: '**',
            redirectTo: 'signin'
        }
    ];
