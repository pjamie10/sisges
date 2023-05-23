import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EGrupo } from '../modelos/EGrupo';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  API_URL: string = environment.apiDAC + "/api/Grupo";
  constructor(private http: HttpClient) {
  }


  listarGrupo(vParametro: string) {
    let params = new HttpParams();

      params = params.append('Parametro', vParametro.toString());

      return this.http.get<any>(`${this.API_URL}/listarGrupo`, { params });
  }

  ObtenerPorId(GrupoId: number) {
    let params = new HttpParams();

    params = params.append('GrupoId', GrupoId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarGrupo(objGrupo: EGrupo) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarGrupo`, objGrupo);
  }

  modificarGrupo(objGrupo: EGrupo) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarGrupo`, objGrupo);
  }

  modificarEstadoGrupo(objGrupo: EGrupo) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoGrupo`, objGrupo);
  }

}
