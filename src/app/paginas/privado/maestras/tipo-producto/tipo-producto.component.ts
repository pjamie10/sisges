import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ETipoProductoListado } from '../../../../modelos/ETipoProducto';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { TipoProductoService } from '../../../../servicios/tipo-producto.service';
import { DatosTipoProductoComponent } from './datos-tipo-producto/datos-tipo-producto.component';

@Component({
  selector: 'app-tipo-producto',
  templateUrl: './tipo-producto.component.html',
  styleUrls: ['./tipo-producto.component.scss']
})
export class TipoProductoComponent implements OnInit {

  lstTipoProducto: Array<ETipoProductoListado> | Array<ETipoProductoListado>;
  txtBuscar: string | "";
  constructor(
    private tipoProductoService: TipoProductoService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstTipoProducto = new Array<ETipoProductoListado>();
    this.lstTipoProducto = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarTipoProducto(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.tipoProductoService.listarTipoProducto(vParametro)
      .subscribe(response => {
        if (response.success) {
          this.lstTipoProducto = response.data;
        }
        else {
          this.lstTipoProducto = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalProductoDatosTipoProducto(TipoProductoId: number) {
    let textoTitulo: string = "";
    if (TipoProductoId == 0) textoTitulo = "Registrar TipoProducto";
    else textoTitulo = "Modificar TipoProducto";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      TipoProductoId: TipoProductoId
    };


    const dialogRef = this.materialDialog.open(DatosTipoProductoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarTipoProducto(objTipoProducto: ETipoProductoListado) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Tipo de Producto ' + objTipoProducto.TipoProductoDescripcion+ ' del Registro ? ', () => {
      objTipoProducto.TipoProductoEstado = "X";
      this.tipoProductoService.modificarEstadoTipoProducto(objTipoProducto).subscribe((respuesta) => {
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
