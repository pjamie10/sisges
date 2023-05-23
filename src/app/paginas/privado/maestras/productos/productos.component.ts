import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductosService } from '../../../../servicios/productos.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { DatosProductosComponent } from './datos-productos/datos-productos.component';
import { EProductos, EProductosListado } from '../../../../modelos/EProductos';
import { ETipoProducto } from '../../../../modelos/ETipoProducto';
import { TipoProductoService } from '../../../../servicios/tipo-producto.service';
import { UsuarioService } from '../../../../servicios/usuario.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  lstProductos: Array<EProductosListado> | Array<EProductosListado>;
  lstTipoProducto: Array<ETipoProducto> = [];
  txtBuscar: string | "";
  constructor(
    private productosService: ProductosService,
    private tipoProductoService: TipoProductoService,
    private usuarioService: UsuarioService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService,

  ) {
    this.lstProductos = new Array<EProductosListado>();
    this.lstProductos = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
    this.listarTipoProducto();
  }

  buscarProductos(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.productosService.listarProductos(vParametro)
      .subscribe((response: { success: any; data: EProductosListado[]; }) => {
        if (response.success) {
          this.lstProductos = response.data;
        }
        else {
          this.lstProductos = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosProductos(ProductoId: string) {
    let textoTitulo: string = "";
    if (ProductoId == "") textoTitulo = "Registrar Producto";
    else textoTitulo = "Modificar Producto";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      ProductoId: ProductoId
    };


    const dialogRef = this.materialDialog.open(DatosProductosComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (data: { success: boolean; }) => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarProducto(objProducto: EProductos) {
    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar ' + objProducto.ProductoNombre +' del Registro?' , () => {
      let objEstadoActual = objProducto.ProductoEstado;
      debugger;
      this.mensajes.msgLoad("Eliminando...");
      objProducto.ProductoEstado = "X";
      this.productosService.modificarEstadoProducto(objProducto).subscribe((respuesta: { success: boolean; }) => {
        if (respuesta.success) {
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
          this.listarDatos(this.txtBuscar);
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
          objProducto.ProductoEstado = objEstadoActual;
        }
      },
        (error: any) => {
          this.mensajes.msgError("No se pudo eliminar el registro.");
          objProducto.ProductoEstado = objEstadoActual;
        })
    });
  }

  listarTipoProducto() {
    this.tipoProductoService.listarTipoProducto("")
      .subscribe((response: { success: boolean; data: Array<ETipoProducto>; }) => {
        if (response.success) {
          this.lstTipoProducto = response.data.filter((x: { TipoProductoEstado: string; }) => x.TipoProductoEstado == "A");
        }
        else {
          this.lstTipoProducto = [];
        }
      }, (error: any) => {

      });
  }

}
