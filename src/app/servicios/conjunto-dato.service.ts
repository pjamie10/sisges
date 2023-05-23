import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EConjuntoDato } from '../modelos/EConjuntoDato';

@Injectable({
  providedIn: 'root'
})
export class ConjuntoDatoService {

  API_URL: string = environment.apiDAC + "/api/conjuntodato";
  constructor(private http: HttpClient) {
  }


  listarPorGrupo(nombreGrupo: string) {
    let params = new HttpParams();

    params = params.append('nombreGrupo', nombreGrupo.toString());

    let resultado = this.http.get<Array<EConjuntoDato>>(`${this.API_URL}/listarPorGrupo`, { params });
    
    return resultado;

  }
}
