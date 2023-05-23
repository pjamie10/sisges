import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  imports: [RouterModule, CommonModule, MatButtonModule],
  declarations: [NavbarComponent],
  exports: [NavbarComponent]
})
export class NavbarModule { }
