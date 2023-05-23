import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EUsuario, EUsuarioListado } from '../../../../modelos/EUsuario';
import { ConjuntoDatoService } from '../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { DatosGrupoComponent } from '../grupo/datos-grupo/datos-grupo.component';
import { DatosUsuarioComponent } from './datos-usuario/datos-usuario.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  lstUsuario: Array<EUsuarioListado> | Array<EUsuarioListado>;
  txtBuscar: string | "";
  constructor(
    private usuarioService: UsuarioService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.lstUsuario = new Array<EUsuarioListado>();
    this.lstUsuario = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarUsuario(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    this.mensajes.msgLoad("Cargando...");
    debugger;
    this.usuarioService.listarUsuario(vParametro)
      .subscribe((response: { success: boolean; data: EUsuarioListado[]; }) => {
        debugger;
        if (response.success) {
          this.lstUsuario = response.data;
        }
        else {
          this.lstUsuario = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirDatosUsuario(UsuarioId: number) {
    //this.router.navigate(['/gestionUsuario/']);
    debugger;
    this.router.navigate(['gestionUsuario', UsuarioId], { relativeTo: this.route });
    //let textoTitulo: string = "";
    //if (UsuarioId == 0) textoTitulo = "Registrar Usuario";
    //else textoTitulo = "Modificar Usuario";

    //const dialogConfig = new MatDialogConfig();

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    //dialogConfig.width = "70%";
    //dialogConfig.height = "85%";
    //dialogConfig.data = {
    //  titulo: textoTitulo,
    //  UsuarioId: UsuarioId
    //};


    //const dialogRef = this.materialDialog.open(DatosUsuarioComponent, dialogConfig);

    //dialogRef.afterClosed().subscribe(
    //  (data: { success: boolean; }) => {
    //    if (data.success) this.listarDatos(this.txtBuscar);
    //  }
    //);


  }

  eliminarUsuario(objUsuario: EUsuario) {
    debugger
    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Registro?', () => {
      objUsuario.UsuarioEstado = "X";
      debugger
      this.usuarioService.modificarEstadoUsuario(objUsuario).subscribe((respuesta: { success: boolean; }) => {
        debugger
        if (respuesta.success) {
          debugger
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
          this.listarDatos(this.txtBuscar);
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        }
      }, () => {
        this.mensajes.msgError("No se pudo eliminar el registro.");
      })
    });
  }

}
