import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EPersonaEmpresa } from '../modelos/EPersonaEmpresa';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class PersonaEmpresaService {

  API_URL: string = environment.apiDAC + "/api/PersonaEmpresa";
  constructor(private http: HttpClient) { }

  listarPersona(vParametro: string) {
    let params = new HttpParams();

    params = params.append('Parametro', vParametro.toString());

    return this.http.get<any>(`${this.API_URL}/listarPersona`, { params });
  }

  ObtenerPorId(PersonaId: number) {
    let params = new HttpParams();

    params = params.append('PersonaId', PersonaId.toString());

    return this.http.get<any>(`${this.API_URL}/obtenerPorId`, { params });
  }

  insertarPersona(objPersona: EPersonaEmpresa) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarPersona`, objPersona);
  }

  modificarPersona(objPersona: EPersonaEmpresa) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarPersona`, objPersona);
  }

  modificarEstadoPersona(objPersona: EPersonaEmpresa) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoPersona`, objPersona);
  }

  buscarPersonaPorTipoNumeroDocumentoInterno(TipoDocumentoId: string, PersonaEmpresaNumeroDocumento: string) {
    let params = new HttpParams();

    params = params.append('vTipoDocumento', TipoDocumentoId.toString());
    params = params.append('vNroDocumento', PersonaEmpresaNumeroDocumento.toString());

    return this.http.get<any>(`${this.API_URL}/BuscarPersonaPorTipoNumeroDocumentoInterno`, { params });
  }

  buscarPersonaPorTipoNumeroDocumentoExterno(TipoDocumentoId: string, PersonaEmpresaNumeroDocumento: string) {
    let params = new HttpParams();

    params = params.append('vTipoDocumento', TipoDocumentoId.toString());
    params = params.append('vNroDocumento', PersonaEmpresaNumeroDocumento.toString());

    return this.http.get<any>(`${this.API_URL}/buscarPersonaPorTipoNumeroDocumentoExterno`, { params });
  }

}
