import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ECategoria } from '../modelos/ECategoria';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  API_URL: string = environment.apiDAC + "/api/Categoria";

  constructor(private http: HttpClient) {
  }


  listarCategoria(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarCategoria`, { params });
  }

  ObtenerPorId(CategoriaId: number) {
    let params = new HttpParams();

    params = params.append('CategoriaId', CategoriaId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarCategoria(objCategoria: ECategoria) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarCategoria`, objCategoria);
  }

  modificarCategoria(objCategoria: ECategoria) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarCategoria`, objCategoria);
  }
  modificarEstadoCategoria(objCategoria: ECategoria) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoCategoria`, objCategoria);
  }
}
