import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EOperadores } from '../modelos/EOperadores';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class OperadoresService {

  API_URL: string = environment.apiDAC + "/api/operadores";

  constructor(private http: HttpClient) {
  }


  listarOperadores(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarOperadores`, { params });
  }

  ObtenerPorId(OperadorId: number) {
    let params = new HttpParams();

    params = params.append('OperadorId', OperadorId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarOperadores(objOperadores: EOperadores) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarOperadores`, objOperadores);
  }

  modificarOperadores(objOperadores: EOperadores) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarOperadores`, objOperadores);
  }
  modificarEstadoOperadores(objOperadores: EOperadores) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoOperadores`, objOperadores);
  }
}
