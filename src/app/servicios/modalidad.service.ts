import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStatusResponse } from './interfaces/server-response';
import { EModalidad } from '../modelos/EModalidad';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModalidadService {

  API_URL: string = environment.apiDAC + "/api/modalidad";

  constructor(private http: HttpClient) {
  }


  listarModalidad(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarModalidad`, { params });
  }

  ObtenerPorId(ModalidadId: number) {
    let params = new HttpParams();

    params = params.append('ModalidadId', ModalidadId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarModalidad(objModalidad: EModalidad) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarModalidad`, objModalidad);
  }

  modificarModalidad(objModalidad: EModalidad) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarModalidad`, objModalidad);
  }

  modificarEstadoModalidad(objModalidad: EModalidad) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoModalidad`, objModalidad);
  }

}
