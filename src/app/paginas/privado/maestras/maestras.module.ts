import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestrasRoutingModule } from './maestras-routing.module';
import { PlanesComponent } from './planes/planes.component';
import { ProductosComponent } from './productos/productos.component';
import { ModalidadComponent } from './modalidad/modalidad.component';
import { PersonaComponent } from './persona/persona.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { MaterialModule } from '../../../material.module';
import { DatosModalidadComponent } from './modalidad/datos-modalidad/datos-modalidad.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatosPersonaComponent } from './persona/datos-persona/datos-persona.component';
import { DatosPlanesComponent } from './planes/datos-planes/datos-planes.component';
import { DatosCategoriaComponent } from './categoria/datos-categoria/datos-categoria.component';
import { DatosProductosComponent } from './productos/datos-productos/datos-productos.component';
import { TipoProductoComponent } from './tipo-producto/tipo-producto.component';
import { DatosTipoProductoComponent } from './tipo-producto/datos-tipo-producto/datos-tipo-producto.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { DatosOperadoresComponent } from './operadores/datos-operadores/datos-operadores.component';
import { ColoresComponent } from './colores/colores.component';
import { DatosColorComponent } from './colores/datos-color/datos-color.component';



@NgModule({
  declarations: [
    PlanesComponent,
    ProductosComponent,
    ModalidadComponent,
    PersonaComponent,
    CategoriaComponent,
    DatosModalidadComponent,
    DatosPersonaComponent,
    DatosPlanesComponent,
    DatosCategoriaComponent,
    DatosProductosComponent,
    TipoProductoComponent,
    DatosTipoProductoComponent,
    OperadoresComponent,
    DatosOperadoresComponent,
    ColoresComponent,
    DatosColorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MaestrasRoutingModule
  ]
})
export class MaestrasModule { }
