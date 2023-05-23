import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EIngreso, EIngresoListado } from '../modelos/EIngreso';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {

  API_URL: string = environment.apiDAC + "/api/ingreso";
  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  insertarIngreso(objIngreso: EIngreso) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarIngreso`, objIngreso);
  }

  listarIngreso(IngresoFechaInicio: Date, IngresoFechaFin:Date) {

    let params = new HttpParams();

/*    params = params.append('Parametro', vParametro.toString());*/
    params = params.append('IngresoFechaInicio', IngresoFechaInicio.toString());
    params = params.append('IngresoFechaFin', IngresoFechaFin.toString());

    return this.http.get<any>(`${this.API_URL}/listarIngreso`, { params });
  }

  obtenerIngreso(vIngresoId: number) {

    let params = new HttpParams();

    params = params.append('IngresoId', vIngresoId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerIngreso`, { params });
  }

  obtenerPorTipoSerieNumeroDocumento(TipoComprobanteId: string, IngresoSerieComprobante: string, IngresoNroComprobante: string) {
    let params = new HttpParams();

    params = params.append('TipoComprobanteId', TipoComprobanteId.toString());
    params = params.append('IngresoSerieComprobante', IngresoSerieComprobante.toString());
    params = params.append('IngresoNroComprobante', IngresoNroComprobante.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorTipoSerieNumeroDocumento`, { params });
  }


  ObtenerPorId(ProductoId: string) {
    let params = new HttpParams();

    params = params.append('ProductoId', ProductoId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  EliminarIngreso(IngresoId: number) {

    let params = new HttpParams();

    params = params.append('IngresoId', IngresoId.toString());

    return this.http.delete<IStatusResponse<any>>(`${this.API_URL}/eliminarIngreso`, { params });
  }
}
