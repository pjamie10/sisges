import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {

  API_URL: string = environment.apiDAC + "/api/comprobante";
  constructor(private http: HttpClient) {
  }


  listarComprobantePorTipo(TipoComprobanteId: string) {
    let params = new HttpParams();

    params = params.append('TipoComprobanteId', TipoComprobanteId);

    return this.http.get<any>(`${this.API_URL}/listarComprobantePorTipo`, { params });

  }

  listarComprobantePorId(ComprobanteId: string) {
    let params = new HttpParams();

    params = params.append('ComprobanteId', ComprobanteId.toString());

    return this.http.get<any>(`${this.API_URL}/listarComprobantePorId`, { params });

  }

 
}
