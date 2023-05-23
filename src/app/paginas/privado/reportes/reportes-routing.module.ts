import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteEquiposComponent } from './reporte-equipos/reporte-equipos.component';
import { StockActualComponent } from './stock-actual/stock-actual.component';

const ReporteRoutes: Routes = [
  {
    path: 'stock-actual',
    component: StockActualComponent
  },
  {
    path: 'reporte-equipos',
    component: ReporteEquiposComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ReporteRoutes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
