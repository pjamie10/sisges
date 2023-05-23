import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { EUsuario, EUsuarioListado } from '../modelos/EUsuario';
import { IStatusResponse } from './interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URL: string = environment.apiDAC + "/api/usuario";
  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  validarUsuario(login: string, clave: string) {
    let params = new HttpParams();
    
    params = params.append('login', login);
    params = params.append('clave', clave);

    return this.http.get<any>(`${this.API_URL}/validarUsuario`, { params });
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    if (localStorage.getItem("token") == null) {
      return "";
    } else {
      return localStorage.getItem("token");
    }
    
  }

  public get logIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  setUsuarioNombre(UsuarioNombre: string) {
    localStorage.setItem("UsuarioNombre", UsuarioNombre);
  }

  setPerfilDefecto(PerfilId: number) {
    localStorage.setItem("PerfilId", PerfilId.toString());
  }

  getPerfilDefecto() {
    return (localStorage.getItem("PerfilId") == null) ? "0" : localStorage.getItem("PerfilId");
  }

  getUsuarioNombre() {
    return localStorage.getItem("UsuarioNombre");
  }

  listarUsuario(vParametro: string) {
    let params = new HttpParams();
    params = params.append('Parametro', vParametro.toString());
    return this.http.get<any>(`${this.API_URL}/listarUsuario`, { params });
  }

  obtenerPorLogin(UsuarioLogin: string) {
    let params = new HttpParams();

    params = params.append('UsuarioLogin', UsuarioLogin);

    return this.http.get<any>(`${this.API_URL}/obtenerUsuarioPorLogin`, { params });
  }

  insertarPerfil(objUsuario: EUsuario) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarUsuario`, objUsuario);
  }

  modificarUsuario(objUsuario: EUsuario) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarUsuario`, objUsuario);
  }

  modificarEstadoUsuario(objUsuario: EUsuario) {
    return this.http.put<IStatusResponse<any>>(`${this.API_URL}/modificarEstadoUsuario`, objUsuario);
  }

  insertarUsuario(objUsuario: EUsuarioListado) {
    return this.http.post<IStatusResponse<any>>(`${this.API_URL}/insertarUsuario`, objUsuario);
  }
}

