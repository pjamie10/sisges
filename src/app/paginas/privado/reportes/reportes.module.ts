import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { StockActualComponent } from './stock-actual/stock-actual.component';
import { ReporteEquiposComponent } from './reporte-equipos/reporte-equipos.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StockActualComponent,
    ReporteEquiposComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }
