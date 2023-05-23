import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './categoria/categoria.component';
import { ProductosComponent } from './productos/productos.component';
import { ModalidadComponent } from './modalidad/modalidad.component';
import { PersonaComponent } from './persona/persona.component';
import { PlanesComponent } from './planes/planes.component';
import { TipoProductoComponent } from './tipo-producto/tipo-producto.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { ColoresComponent } from './colores/colores.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const MaestrasRoutes: Routes = [
  //{
  //  path: 'modalidades',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'planes',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'personas',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'categorias',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'productos',
  //  component: DashboardComponent
  //}
  //,
  //{
  //  path: 'colores',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'tipo-producto',
  //  component: DashboardComponent
  //},
  //{
  //  path: 'operadores',
  //  component: DashboardComponent
  //}
];


@NgModule({
  imports: [RouterModule.forChild(MaestrasRoutes)],
  exports: [RouterModule]
})
export class MaestrasRoutingModule { }
