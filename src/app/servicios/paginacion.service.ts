import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { EIngreso } from '../modelos/EIngreso';
import { EPaginadoSolicitud } from '../modelos/EPaginado';
import { EVenta } from '../modelos/EVenta';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class PaginacionService {
  temppage: number = 0;
  pageField: number[] = [];
  exactPageList: any;

  constructor() {
  }

  // On page load   
  pageOnLoad() {
    if (this.temppage == 0) {

      this.pageField = [];
      for (var a = 0; a < this.exactPageList; a++) {
        this.pageField[a] = this.temppage + 1;
        this.temppage = this.temppage + 1;
      }
    }
  }
}
