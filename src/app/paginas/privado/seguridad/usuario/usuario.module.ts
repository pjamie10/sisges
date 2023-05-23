import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario.component';
import { RouterModule, Routes } from '@angular/router';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';
import { MaterialModule } from '../../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: UsuarioComponent
  },
  {
    path: 'gestionUsuario/:id', component: GestionUsuariosComponent
  }

];

@NgModule({
  declarations: [GestionUsuariosComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})

export class UsuarioModule { }
