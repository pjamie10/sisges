import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ValidarPermisos } from '../../../../componentes/validar-permisos';
import { EPerfil, EPerfilListado } from '../../../../modelos/EPerfil';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { PerfilService } from '../../../../servicios/perfil.service';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { DatosPerfilComponent } from './datos-perfil/datos-perfil.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {


  lstPerfil: Array<EPerfilListado> | Array<EPerfilListado>;
  txtBuscar: string | "";

  verEliminados: boolean = false;

  constructor(
    private perfilService: PerfilService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService,
    private usuarioService: UsuarioService,
  ) {
    this.lstPerfil = new Array<EPerfilListado>();
    this.lstPerfil = [];
    this.txtBuscar = "";
  }


  permisos(vPerfilId:number) {
    this.verEliminados=ValidarPermisos.verEliminados(vPerfilId);
  }



  ngOnInit(): void {
    let vPerfilId: number = parseInt(this.usuarioService.getPerfilDefecto()!);
    this.permisos(vPerfilId);
    this.listarDatos(this.txtBuscar);
  }

  buscarPerfil(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    this.perfilService.listarPerfil(vParametro)
      .subscribe((response: { success: boolean; data: EPerfilListado[]; }) => {
        if (response.success) {
          if (this.verEliminados) {
            this.lstPerfil = response.data;
          } else {
            this.lstPerfil = response.data.filter(x => x.PerfilEstado != "X");
          }
          
        }
        else this.lstPerfil = [];
      });
  }

  abrirPerDatosPerfil(PerfilId: number) {
    let textoTitulo: string = "";
    if (PerfilId == 0) textoTitulo = "Registrar Perfil";
    else textoTitulo = "Modificar Perfil";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      PerfilId: PerfilId
    };


    const dialogRef = this.materialDialog.open(DatosPerfilComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarPerfil(objPerfil: EPerfil) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Registro?', () => {
      objPerfil.PerfilEstado = "X";
      this.perfilService.modificarEstadoPerfil(objPerfil).subscribe((respuesta) => {
        if (respuesta.success) {
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
          this.listarDatos(this.txtBuscar);
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        }
      },
        error => {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        })
    });
  }

}
