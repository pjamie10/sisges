import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ECategoria, ECategoriaListado } from '../../../../modelos/ECategoria';
import { CategoriaService } from '../../../../servicios/categoria.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { DatosCategoriaComponent } from './datos-categoria/datos-categoria.component';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  lstCategoria: Array<ECategoriaListado> | Array<ECategoriaListado>;
  txtBuscar: string | "";
  constructor(
    private categoriaService: CategoriaService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService,

  ) {
    this.lstCategoria = new Array<ECategoriaListado>();
    this.lstCategoria = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarCategoria(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.categoriaService.listarCategoria(vParametro)
      .subscribe(response => {
        if (response.success) {
          this.lstCategoria = response.data;
        }
        else {
          this.lstCategoria = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirModalDatosCategoria(CategoriaId: number) {
    let textoTitulo: string = "";
    if (CategoriaId == 0) textoTitulo = "Registrar Categoria";
    else textoTitulo = "Modificar Categoria";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      CategoriaId: CategoriaId
    };


    const dialogRef = this.materialDialog.open(DatosCategoriaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );


  }

  eliminarCategoria(objCategoria: ECategoria) {

    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar la Categoria ' +objCategoria.CategoriaNombre+ ' del Registro?', () => {
      objCategoria.CategoriaEstado = "X";
      this.categoriaService.modificarEstadoCategoria(objCategoria).subscribe((respuesta) => {
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
