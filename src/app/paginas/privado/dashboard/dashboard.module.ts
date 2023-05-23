import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutes } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
  ]
})
export class DashboardModule { }
