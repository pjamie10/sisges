import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PagesRoutes } from './app.routing';
import { AuthLayoutComponent } from './layout/auth/authLayout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './layout/admin/adminLayout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarModule } from './sidebar/sidebar.module';
import { HttpClientModule } from '@angular/common/http';
import { NavbarModule } from './shared/navbar/navbar.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ComponentesModule } from './componentes/componentes.module';
import { CookieService } from 'ngx-cookie-service';
import { ReportesModule } from './paginas/privado/reportes/reportes.module';
import { DashboardComponent } from './paginas/privado/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(PagesRoutes),
    BrowserAnimationsModule,
    SidebarModule,
    ComponentesModule,
    NavbarModule,
    ReportesModule,
/*    AngularFireModule.initializeApp(environment.firebaseConfig)*/
  ],
  providers: [CookieService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
