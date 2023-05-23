import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EPerfil } from '../modelos/EPerfil';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  API_URL: string = environment.apiDAC + "/api/perfil";

  constructor(private http: HttpClient) {
  }


  listarPerfil(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarPerfil`, { params });
  }

  ObtenerPorId(PerfilId: number) {
    let params = new HttpParams();

    params = params.append('PerfilId', PerfilId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarPerfil(objPerfil: EPerfil) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarPerfil`, objPerfil);
  }

  modificarPerfil(objPerfil: EPerfil) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarPerfil`, objPerfil);
  }
  modificarEstadoPerfil(objPerfil: EPerfil) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoPerfil`, objPerfil);
  }
}
