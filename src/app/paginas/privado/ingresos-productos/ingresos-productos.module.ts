import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { NuevosIngresosProductosComponent } from './nuevos-ingresos-productos/nuevos-ingresos-productos.component';
import { IngresosProductosComponent } from './ingresos-productos.component';
import { RouterModule, Routes } from '@angular/router';
import { AgregarDetalleComponent } from './nuevos-ingresos-productos/agregar-detalle/agregar-detalle.component';
import { ModificarIngresosProductosComponent } from './modificar-ingresos-productos/modificar-ingresos-productos.component';
import { VerIngresosProductosComponent } from './ver-ingresos-productos/ver-ingresos-productos.component';
import { IngresosRoutingModule } from './ingresos-routing.module';


@NgModule({
  declarations: [
    IngresosProductosComponent,
    NuevosIngresosProductosComponent,
    AgregarDetalleComponent,
    ModificarIngresosProductosComponent,
    VerIngresosProductosComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    IngresosRoutingModule
  ]
})
export class IngresosProductosModule { }
