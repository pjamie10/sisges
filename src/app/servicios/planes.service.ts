import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EPlanes, EPlanesListado } from '../modelos/EPlanes';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

  API_URL: string = environment.apiDAC + "/api/Planes";

  constructor(private http: HttpClient) { }


  listarPlanes(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarPlanes`, { params });
  }

  ObtenerPorId(PlanId: number) {
    let params = new HttpParams();
    params = params.append('PlanId', PlanId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarPlanes(objPlanes: EPlanes) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarPlanes`, objPlanes);
  }

  modificarPlanes(objPlanes: EPlanes) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarPlanes`, objPlanes);
  }

  modificarEstadoPlanes(objPlanes: EPlanesListado) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoPlanes`, objPlanes);
  }

}
