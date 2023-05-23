import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateViaAuthGuard } from '../componentes/can-activate-via-auth.guard';
import { AdminLayoutComponent } from '../layout/admin/adminLayout.component';
import { AuthLayoutComponent } from '../layout/auth/authLayout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './privado/dashboard/dashboard.component';
import { IngresosProductosComponent } from './privado/ingresos-productos/ingresos-productos.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'ingresos',
        loadChildren: () => import('./privado/ingresos-productos/ingresos-productos.module').then(m => m.IngresosProductosModule),
        canActivate: [CanActivateViaAuthGuard]
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'maestras',
        loadChildren: () => import('./privado/maestras/maestras.module').then(m => m.MaestrasModule),
      }
    ]
  }
];
