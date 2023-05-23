import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresosProductosComponent } from './ingresos-productos.component';
import { ModificarIngresosProductosComponent } from './modificar-ingresos-productos/modificar-ingresos-productos.component';
import { NuevosIngresosProductosComponent } from './nuevos-ingresos-productos/nuevos-ingresos-productos.component';
import { VerIngresosProductosComponent } from './ver-ingresos-productos/ver-ingresos-productos.component';

export const IngresosRoutes: Routes = [
  {
    path: '',
    component: IngresosProductosComponent
  },
  {

    path: 'nuevoIngreso',
    component: NuevosIngresosProductosComponent
  },
  {

    path: 'editarIngreso/:id',
    component: ModificarIngresosProductosComponent
  },
  {

    path: 'verIngreso/:id',
    component: VerIngresosProductosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(IngresosRoutes)],
  exports: [RouterModule]
})
export class IngresosRoutingModule { }
