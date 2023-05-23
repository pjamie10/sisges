import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EColor, EColorListado } from '../../../../modelos/EColor';
import { ColorService } from '../../../../servicios/color.service ';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { DatosColorComponent } from './datos-color/datos-color.component';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.component.html',
  styleUrls: ['./colores.component.scss']
})
export class ColoresComponent implements OnInit {

  lstColor: Array<EColorListado> | Array<EColorListado>;
  txtBuscar: string | "";
  constructor(
    private colorService: ColorService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstColor = new Array<EColorListado>();
    this.lstColor = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarColor(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.colorService.listarColor(vParametro)
      .subscribe(response => {
        if (response.success) {
          this.lstColor = response.data;
        }
        else {
          this.lstColor = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosColor(ColorId: number) {
    let textoTitulo: string = "";
    debugger;
    if (ColorId == 0) textoTitulo = "Registrar Color";
    else textoTitulo = "Modificar Color";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      ColorId: ColorId
    };
    const dialogRef = this.materialDialog.open(DatosColorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data: { success: boolean; }) => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );
  }

  eliminarColor(objColor: EColor) {
    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el color ' + objColor.ColorDescripcion+ ' del Registro ? ', () => {
      objColor.ColorEstado = "X";
      this.colorService.modificarEstadoColor(objColor).subscribe((respuesta) => {
        debugger;
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
