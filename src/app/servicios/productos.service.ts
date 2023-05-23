import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EProductos, EProductosListado } from '../modelos/EProductos';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {


  API_URL: string = environment.apiDAC + "/api/Productos";

  constructor(private http: HttpClient) {
  }


  listarProductos(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarProductos`, { params });
  }

  listarProductosPorTipo(TipoProductoId: number) {
    let params = new HttpParams();

    params = params.append('TipoProductoId', TipoProductoId.toString());

    return this.http.get<any>(`${this.API_URL}/listarProductosPorTipo`, { params });
  }

  ObtenerPorId(ProductoId: string) {
    let params = new HttpParams();

    params = params.append('ProductoId', ProductoId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  ObtenerPorCodigo(tipoProductoId:number,Parametro: string) {
    let params = new HttpParams();

    params = params.append('TipoProductoId', tipoProductoId.toString());
    params = params.append('Parametro', Parametro.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorCodigo`, { params });
  }

  insertarProducto(objProductos: EProductos) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarProducto`, objProductos);
  }

  modificarProducto(objProductos: EProductos) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarProducto`, objProductos);
  }
  modificarEstadoProducto(objProductos: EProductos) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoProducto`, objProductos);
  }
}
