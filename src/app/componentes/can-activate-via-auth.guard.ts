import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MensajesService } from '../servicios/mensajes.service';
import { UsuarioService } from '../servicios/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateViaAuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router, private mensajeService: MensajesService) { }

  canActivate() {
    
    if (this.usuarioService.getToken() == "") {
      this.mensajeService.msgErrorSeguridad("¡USTED NO TIENE ACCESO AL RECURSO SOLICITADO!");
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
  
}
