import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivadoRoutingModule } from './privado-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockActualComponent } from './reportes/stock-actual/stock-actual.component';
import { ReporteEquiposComponent } from './reportes/reporte-equipos/reporte-equipos.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrivadoRoutingModule
  ]
})
export class PrivadoModule { }
