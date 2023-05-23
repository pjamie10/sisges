import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { catchError, filter, finalize, map } from 'rxjs/operators';
import { EModalidad, EModalidadListado } from '../../../../modelos/EModalidad';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { ModalidadService } from '../../../../servicios/modalidad.service';
import { DatosModalidadComponent } from './datos-modalidad/datos-modalidad.component';

@Component({
  selector: 'app-modalidad',
  templateUrl: './modalidad.component.html',
  styleUrls: ['./modalidad.component.scss']
})
export class ModalidadComponent implements OnInit {

  lstModalidad: Array<EModalidadListado> | Array<EModalidadListado>;
  txtBuscar: string | "";
  constructor(
    private modalidadService: ModalidadService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstModalidad = new Array<EModalidadListado>();
    this.lstModalidad = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarModalidad(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.modalidadService.listarModalidad(vParametro)
      .subscribe((response: { success: boolean; data: EModalidadListado[]; }) => {
        if (response.success) {
          this.lstModalidad = response.data;
        }
        else {
          this.lstModalidad = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosModalidad(ModalidadId: number) {
    let textoTitulo: string = "";
    debugger;
    if (ModalidadId == 0) textoTitulo = "Registrar Modalidad";
    else textoTitulo = "Modificar Modalidad";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      ModalidadId: ModalidadId
    };


    const dialogRef = this.materialDialog.open(DatosModalidadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data: { success: boolean; }) => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarModalidad(objModalidad: EModalidad) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar la Modalidad ' + objModalidad.ModalidadNombre+ ' del Registro ? ', () => {
      objModalidad.ModalidadEstado = "X";
      this.modalidadService.modificarEstadoModalidad(objModalidad).subscribe((respuesta: { success: boolean; }) => {
        debugger;
        if (respuesta.success) {
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
          this.listarDatos(this.txtBuscar);
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        }
      },() => {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        })
    });
  }
}
