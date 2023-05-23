import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ETipoProducto, ETipoProductoListado } from '../modelos/ETipoProducto';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class TipoProductoService {

  API_URL: string = environment.apiDAC + "/api/Tipo-Producto";

  constructor(private http: HttpClient) { }


  listarTipoProducto(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarTipoProducto`, { params });
  }

  ObtenerPorId(TipoProductoId: number) {
    let params = new HttpParams();
    params = params.append('TipoProductoId', TipoProductoId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarTipoProducto(objTipoProducto: ETipoProducto) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarTipoProducto`, objTipoProducto);
  }

  modificarTipoProducto(objTipoProducto: ETipoProducto) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarTipoProducto`, objTipoProducto);
  }

  modificarEstadoTipoProducto(objTipoProducto: ETipoProductoListado) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoTipoProducto`, objTipoProducto);
  }

}
