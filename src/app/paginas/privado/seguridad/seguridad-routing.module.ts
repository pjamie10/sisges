import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateViaAuthGuard } from '../../../componentes/can-activate-via-auth.guard';
import { GrupoComponent } from './grupo/grupo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { GestionUsuariosComponent } from './usuario/gestion-usuarios/gestion-usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';

export const SeguridadRoutes: Routes = [
  {
    path: 'grupo',
    component: GrupoComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'usuario',
    children: [
      { path: '', loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), data: { titulo: 'Transferencias Pendientes de Justificar' } },
    ],
    canActivate: [CanActivateViaAuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(SeguridadRoutes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
