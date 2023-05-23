import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EColor } from '../modelos/EColor';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  API_URL: string = environment.apiDAC + "/api/color";
  constructor(private http: HttpClient) {
  }


  listarColor(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarColor`, { params });

  }

  ObtenerPorId(ColorId: number) {
    let params = new HttpParams();

    params = params.append('ColorId', ColorId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarColor(objColor: EColor) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarColor`, objColor);
  }

  modificarColor(objColor: EColor) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarColor`, objColor);
  }

  modificarEstadoColor(objColor: EColor) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoColor`, objColor);
  }

 
}
