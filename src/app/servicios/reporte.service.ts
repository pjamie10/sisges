import { HttpClient, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { EProductosListado } from '../modelos/EProductos';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  API_URL: string = environment.apiDAC + "/api/reportes";
  constructor(private http: HttpClient, private cookies: CookieService) {
  }



  obtenerReporteVenta(VentaFechaInicio: Date, VentaFechaFin: Date) {
    let params = new HttpParams();
    debugger;
    params = params.append('VentaFechaInicio', VentaFechaInicio.toString());
    params = params.append('VentaFechaFin', VentaFechaFin.toString());

    let headers = new HttpHeaders();
    headers = headers.set("Accept", "application/octet-stream");

    return this.http.get(
      `${this.API_URL}/reporteVentas`, { params })

    //return this.http.get(`${this.API_URL}/reporteVentas`, { params } , {
    //  headers: headers,
    //  responseType: "blob"
    //});
  }

  obtenerReporteStockProductos() {
    let headers = new HttpHeaders();

    headers = headers.set("Accept", "application/octet-stream");

    return this.http.post(`${this.API_URL}/reporteStockProductos`, {}, {
      headers: headers,
      responseType: "blob"
    });
  }

  StockProductosIngresados(TipoProductoId: number) {
    let params = new HttpParams();

    params = params.append('TipoProductoId', TipoProductoId.toString());

    return this.http.get<any>(`${this.API_URL}/stockProductos`, { params });
  }

  convertDataURIToBinary(bytesFile: string): Uint8Array {
    const raw = window.atob(bytesFile);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}



