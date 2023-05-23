import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EPlanesListado } from '../../../../modelos/EPlanes';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { PlanesService } from '../../../../servicios/planes.service';
import { DatosPlanesComponent } from './datos-planes/datos-planes.component';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  lstPlanes: Array<EPlanesListado> | Array<EPlanesListado>;
  txtBuscar: string | "";
  constructor(
    private planesService: PlanesService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstPlanes = new Array<EPlanesListado>();
    this.lstPlanes = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarPlanes(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.planesService.listarPlanes(vParametro)
      .subscribe((response: { success: boolean; data: EPlanesListado[]; }) => {
        if (response.success) {
          this.lstPlanes = response.data;
        }
        else {
          this.lstPlanes = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosPlanes(PlanId: number) {
    let textoTitulo: string = "";
    if (PlanId == 0) textoTitulo = "Registrar Plan";
    else textoTitulo = "Modificar Plan";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      PlanId: PlanId
    };


    const dialogRef = this.materialDialog.open(DatosPlanesComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarPlanes(objPlanes: EPlanesListado) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Plan ' + objPlanes.PlanDescripcion + '?', () => {
      objPlanes.PlanEstado = "X";
      debugger;
      this.planesService.modificarEstadoPlanes(objPlanes).subscribe((respuesta) => {
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
