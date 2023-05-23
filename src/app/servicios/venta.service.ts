import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { EIngreso } from '../modelos/EIngreso';
import { EPaginadoSolicitud } from '../modelos/EPaginado';
import { EVenta } from '../modelos/EVenta';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  API_URL: string = environment.apiDAC + "/api/venta";
  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  insertarVenta(objVenta: EVenta) {
    debugger;
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarVenta`, objVenta);
  }

  obtenerListas() {
    return this.http.get<any>(`${this.API_URL}/obtenerListas`);
  }

  listarVentas(VentaFechaInicio: Date, VentaFechaFin: Date) {
    let params = new HttpParams();

    params = params.append('VentaFechaInicio', VentaFechaInicio.toString());
    params = params.append('VentaFechaFin', VentaFechaFin.toString());

    return this.http.get<any>(`${this.API_URL}/listarVentas`, { params });
  }

  listarVentasPaginado(VentaFechaInicio: Date, VentaFechaFin: Date,objPaginado:EPaginadoSolicitud) {
    let params = new HttpParams();

    params = params.append('VentaFechaInicio', VentaFechaInicio.toString());
    params = params.append('VentaFechaFin', VentaFechaFin.toString());
    params = params.append('PaginaNumero', objPaginado.PaginaNumero.toString());
    params = params.append('PaginaTamanio', objPaginado.PaginaTamanio.toString());
    params = params.append('OrdenarPor', objPaginado.OrdenarPor.toString());

    return this.http.get<any>(`${this.API_URL}/listarVentasPaginado`, { params });
  }

}
