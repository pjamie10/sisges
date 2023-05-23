import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EOperadores, EOperadoresListado } from '../../../../modelos/EOperadores';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { OperadoresService } from '../../../../servicios/operadores.service';
import { DatosOperadoresComponent } from './datos-operadores/datos-operadores.component';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss']
})
export class OperadoresComponent implements OnInit {

  lstOperadores: Array<EOperadoresListado> | Array<EOperadoresListado>;
  txtBuscar: string | "";
  constructor(
    private operadoresService: OperadoresService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService,

  ) {
    this.lstOperadores = new Array<EOperadoresListado>();
    this.lstOperadores = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarOperadores(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    } 
    this.operadoresService.listarOperadores(vParametro)
      .subscribe((response: { success: boolean; data: EOperadoresListado[]; }) => {
        if (response.success) {
          this.lstOperadores = response.data;
        }
        else {
          this.lstOperadores = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosOperadores(OperadorId: number) {
    let textoTitulo: string = "";
    if (OperadorId == 0) textoTitulo = "Registrar Operador";
    else textoTitulo = "Modificar Operador";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      OperadorId: OperadorId
    };


    const dialogRef = this.materialDialog.open(DatosOperadoresComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarOperadores(objOperadores: EOperadores) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Operador ' + objOperadores.OperadorDescripcion+' del Registro ? ', () => {
      objOperadores.OperadorEstado = "X";
      this.operadoresService.modificarEstadoOperadores(objOperadores).subscribe((respuesta) => {
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
