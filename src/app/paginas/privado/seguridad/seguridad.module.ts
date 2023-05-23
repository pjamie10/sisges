import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguridadRoutingModule } from './seguridad-routing.module';
import { GrupoComponent } from './grupo/grupo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosPerfilComponent } from './perfil/datos-perfil/datos-perfil.component';
import { DatosGrupoComponent } from './grupo/datos-grupo/datos-grupo.component';
import { DatosUsuarioComponent } from './usuario/datos-usuario/datos-usuario.component';

@NgModule({
  declarations: [
    DatosGrupoComponent,
    GrupoComponent,
    PerfilComponent,
    UsuarioComponent,
    DatosPerfilComponent,
    DatosUsuarioComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SeguridadRoutingModule
  ]
})
export class SeguridadModule { }
