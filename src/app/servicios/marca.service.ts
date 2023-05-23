import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStatusResponse } from './interfaces/server-response';
import { EModalidad } from '../modelos/EModalidad';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  API_URL: string = environment.apiDAC + "/api/marca";
  constructor(private http: HttpClient) {
  }


  listarMarca(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarMarca`, { params });

  }

 
}
