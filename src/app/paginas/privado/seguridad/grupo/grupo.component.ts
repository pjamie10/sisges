import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EGrupo, EGrupoListado } from '../../../../modelos/EGrupo';
import { GrupoService } from '../../../../servicios/grupo.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { DatosGrupoComponent } from './datos-grupo/datos-grupo.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.scss']
})
export class GrupoComponent implements OnInit {
  lstGrupo: Array<EGrupoListado> | Array<EGrupoListado>;
  txtBuscar: string | "";
  constructor(
    private grupoService: GrupoService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstGrupo = new Array<EGrupoListado>();
    this.lstGrupo = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarGrupo(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    
    this.grupoService.listarGrupo(vParametro)
      .subscribe((response: { success: boolean; data: EGrupoListado[]; }) => {
        
        if (response.success) this.lstGrupo = response.data;
        else this.lstGrupo = [];
      });
  }

  abrirModalDatosGrupo(GrupoId: number) {
    let textoTitulo: string = "";
    if (GrupoId == 0) textoTitulo = "Registrar Grupo";
    else textoTitulo = "Modificar Grupo";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      GrupoId: GrupoId
    };


    const dialogRef = this.materialDialog.open(DatosGrupoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data: { success: boolean; }) => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarGrupo(objGrupo: EGrupo) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Registro?', () => {
      objGrupo.GrupoEstado = "X";
      this.grupoService.modificarEstadoGrupo(objGrupo).subscribe((respuesta: { success: boolean; }) => {
        if (respuesta.success) {
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
