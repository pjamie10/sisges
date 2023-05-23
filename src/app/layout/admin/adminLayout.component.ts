import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EUsuarioListado } from '../../modelos/EUsuario';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html',
  styleUrls: ['./adminlayout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  nombreUsuario: string = "";

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {

  }


}
