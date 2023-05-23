import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas.component';
import { RouterModule, Routes } from '@angular/router';
import { NuevaVentaComponent } from './nueva-venta/nueva-venta.component';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AltaPrepagoComponent } from './nueva-venta/alta-prepago/alta-prepago.component';
import { AltaPostpagoComponent } from './nueva-venta/alta-postpago/alta-postpago.component';
import { PortaPostpagoComponent } from './nueva-venta/porta-postpago/porta-postpago.component';
import { PortaPrepagoComponent } from './nueva-venta/porta-prepago/porta-prepago.component';
import { RenoPostpagoComponent } from './nueva-venta/reno-postpago/reno-postpago.component';
import { RenoPrepagoComponent } from './nueva-venta/reno-prepago/reno-prepago.component';

export const VentasRoutes: Routes = [
  {

    path: 'ventas',
    component: VentasComponent
  },
  {

    path: 'nuevaVenta',
    component: NuevaVentaComponent
  }
];

@NgModule({
  declarations: [
    VentasComponent,
    NuevaVentaComponent,
    AltaPrepagoComponent,
    AltaPostpagoComponent,
    PortaPostpagoComponent,
    PortaPrepagoComponent,
    RenoPostpagoComponent,
    RenoPrepagoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(VentasRoutes),
    FormsModule,
    ReactiveFormsModule,    
    MaterialModule
  ]
})
export class VentasModule { }
