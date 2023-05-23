import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { ValidarControles } from '../../../../componentes/validar-controles';
import { EColor } from '../../../../modelos/EColor';
import { EMarca } from '../../../../modelos/EMarca';
import { EProductos, EProductosListado } from '../../../../modelos/EProductos';
import { ETipoProductoListado } from '../../../../modelos/ETipoProducto';
import { ColorService } from '../../../../servicios/color.service ';
import { ConjuntoDatoService } from '../../../../servicios/conjunto-dato.service';
import { MarcaService } from '../../../../servicios/marca.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { ProductosService } from '../../../../servicios/productos.service';
import { ReporteService } from '../../../../servicios/reporte.service';
import { TipoProductoService } from '../../../../servicios/tipo-producto.service';

@Component({
  selector: 'app-stock-actual',
  templateUrl: './stock-actual.component.html',
  styleUrls: ['./stock-actual.component.scss']
})
export class StockActualComponent implements OnInit {
  frmPrincipal: FormGroup;
  lstProductos: Array<EProductosListado> | Array<EProductosListado>;
  lstTipoProducto: Array<ETipoProductoListado> | Array<ETipoProductoListado>;
  lstMarca: Array<EMarca> | undefined
  lstColor: Array<EColor> | undefined
  vTipoProductoId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servMarca: MarcaService,
    private servColor: ColorService,
    private mensajes: MensajesService,
    private productosService: ProductosService,
    private reporteService: ReporteService,
    private tipoProductoService: TipoProductoService
  ){
    this.frmPrincipal = this.formBuilder.group({
      TipoProductoId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoProducto])]
    });
    this.lstTipoProducto = new Array<ETipoProductoListado>();
    this.lstTipoProducto = [];
    this.lstProductos = new Array<EProductosListado>();
    this.lstProductos = [];
  }

  ngOnInit(): void {
    this.listarTipoProducto("");
  }

  listarTipoProducto(vParametro: string) {
    this.tipoProductoService.listarTipoProducto(vParametro)
      .subscribe((response: { success: any; data: any[]; }) => {

        if (response.success) {
          this.lstTipoProducto = response.data.filter((x: { TipoProductoEstado: string; }) => x.TipoProductoEstado == "A");
        }
        else {
          this.lstTipoProducto = [];
        }
      });
  }

  seleccionarTipoProducto(TipoProductoId: number) {

    this.vTipoProductoId = TipoProductoId;
    this.reporteService.StockProductosIngresados(TipoProductoId)
      .subscribe((response: { success: any; data: Array<EProductosListado>; }) => {
        if (response.success) {
          this.lstProductos = response.data;
          debugger;
        }
        else {
          this.lstProductos = [];
        }
      });

  }

  descargarReporte() {
    setTimeout(() => {
      this.reporteService.obtenerReporteStockProductos().subscribe(
        (file: Blob) => {
          debugger;
          let hoy = new Date().toISOString();
          FileSaver.saveAs(file, "reporteStockProductos - "+hoy +".xlsx");
        },
        () => {
          //this.messageService.msgAutoClose();
          var message = "Se produjo un error al momento de ejecución. Contacte a un administrador para un mejor soporte.";
          //Swal.fire("Error!", message, "error");
        }
      );
    }, 500);
  }

  get TipoProductoId() { return this.frmPrincipal.get('TipoProductoId') }
}
