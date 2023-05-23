import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { isNumeric } from 'jquery';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EProductos, EProductosListado } from '../../../../../modelos/EProductos';
import { ETipoProductoListado } from '../../../../../modelos/ETipoProducto';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ProductosService } from '../../../../../servicios/productos.service';
import { TipoProductoService } from '../../../../../servicios/tipo-producto.service';

declare const $: any;
@Component({
  selector: 'app-agregar-detalle',
  templateUrl: './agregar-detalle.component.html',
  styleUrls: ['./agregar-detalle.component.scss']
})
export class AgregarDetalleComponent implements OnInit {
  titulo: string = "";
  frmPrincipal: FormGroup;
  objProducto: EProductos;
  lstProducto: Array<EProductosListado> | Array<EProductosListado>;
  lstTipoProducto: Array<ETipoProductoListado> | Array<ETipoProductoListado>;
  lstProductoFiltrado: Array<EProductosListado> | Array<EProductosListado>;
  vTipoProductoId: number = 0;
  vProductoId: string = "";
  lstIMEI: string[];
  vTotalIMEI = 0;
  lstNmrSerie: string[];
  vTotalNmrSerie = 0;
  lstChip: string[];
  vTotalChip = 0;
  seleccion: string = "";
  mensajesValidacion = {
    'txtIMEI': [
      { type: 'required', message: 'El IMEI es obligatorio.' },
      { type: 'maxlength', message: 'El IMEI debe contener máximo 15 digitos.' },
      { type: 'pattern', message: 'El IMEI sólo debe contener digitos.' },
      { type: 'validarIMEI', message: 'El IMEI debe contener 15 digitos.' }
    ]
  }

  constructor(
    public matDialogRef: MatDialogRef<AgregarDetalleComponent>,
    private tipoProductoService: TipoProductoService,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private productosService: ProductosService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      ProductoId: ["", Validators.compose([Validators.required])],
      TipoProductoId: [0, Validators.compose([Validators.required])],
      TipoProducto: [null, Validators.required],
      Producto: [null, Validators.required],
      Estado: [null, Validators.required],
      cantidadIMEI: "",
      cantidadNmrSerie: "",
      tipoChip: "",
      cantidadChip: "",
      txtImei: "",
      desde: "",
      hasta: ""
    });
    this.objProducto = new EProductos();
    this.lstTipoProducto = new Array<ETipoProductoListado>();
    this.lstTipoProducto = [];
    this.lstProducto = new Array<EProductosListado>();
    this.lstProducto = [];
    this.lstProductoFiltrado = new Array<EProductosListado>();
    this.lstProductoFiltrado = [];
    this.lstIMEI = [];
    this.lstNmrSerie = [];
    this.lstChip = [];
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


  //listarProducto(vParametro: string) {
  //  this.productosService.listarProductos(vParametro)
  //    .subscribe((response: { success: any; data: any[]; }) => {
  //      if (response.success) {
  //        this.lstProducto = response.data.filter((x: { ProductoEstado: string; }) => x.ProductoEstado == "A");
  //        this.lstProductoFiltrado = this.lstProducto .slice();

  //      }
  //      else {
  //        this.lstProducto = [];
  //      }
  //    });
  //}

  seleccionarTipoProducto(TipoProductoId: number) {

    this.vTipoProductoId = TipoProductoId;
    this.productosService.listarProductosPorTipo(TipoProductoId)
      .subscribe((response: { success: any; data: Array<EProductosListado>; }) => {
        if (response.success) {
          this.lstProducto = response.data.filter((x: { ProductoEstado: string; }) => x.ProductoEstado == "A");
          this.lstProductoFiltrado = this.lstProducto.slice();
        }
        else {
          this.lstProducto = [];
        }
      });

  }

  seleccionarProducto(ProductoId: string) {
    this.vProductoId = ProductoId;
  }

  generarIMEI() {

    this.lstIMEI = [];
    this.vTotalIMEI = parseInt(this.cantidadIMEI?.value);

    let i = 0;
    for (let i = 0; i < this.vTotalIMEI; i++) {
      this.lstIMEI.push("");
    }
  }

  generarNmrSerie() {
    this.lstNmrSerie = [];
    this.vTotalNmrSerie = parseInt(this.cantidadNmrSerie?.value);

    let i = 0;
    for (let i = 0; i < this.vTotalNmrSerie; i++) {
      this.lstNmrSerie.push("");
    }
  }

  seleccionado(objSeleccion: string) {

    this.seleccion = objSeleccion;
    //this.seleccion = $(event.currentTarget).find("input[name=seleccionChip]")[0].value;
  }

  validarIMEI(evento: any, indice: number) {
    debugger;
    if (evento.currentTarget.value.trim().length == 15) {
      $("#mf_" + indice.toString())[0].classList.remove("has-danger");
      $("#mf_" + indice.toString())[0].classList.add("has-success");
      $("#clear_" + indice)[0].style.display = "none";
      $("#done_" + indice)[0].style.display = "initial";
    } else {
      $("#mf_" + indice.toString())[0].classList.remove("has-success");
      $("#mf_" + indice.toString())[0].classList.add("has-danger");
      $("#clear_" + indice)[0].style.display = "display";
      $("#done_" + indice)[0].style.display = "none";
    }
  }

  guardarDatos() {
    let lstProductosAgregados = new Array<EProductosListado>();
    let itemCorrecto = false;
    debugger;
    /*
     *EQUIPOS CELULARES: 1
     *LECTORES BIOMÉTRICOS: 2
     *CHIPS: 3
     */
    if (this.vTipoProductoId == 1) {
      let lstIMEIIngresados = $('input[name=txtIMEI]');
      for (let i = 0; i <= this.lstIMEI.length - 1; i++) {
        let objProductoAgregado = new EProductosListado();
        objProductoAgregado.TipoProductoTexto = this.lstTipoProducto.find(objTipoProducto => objTipoProducto.TipoProductoId == this.vTipoProductoId)?.TipoProductoDescripcion;
        objProductoAgregado.ProductoId = this.vProductoId
        objProductoAgregado.ProductoNombre = this.lstProducto.find(objProducto => objProducto.ProductoId == this.vProductoId)?.ProductoNombre;
        objProductoAgregado.ProductoCodigo = lstIMEIIngresados[i].value;
        itemCorrecto = (objProductoAgregado.ProductoCodigo.trim().length == 15);
        if (itemCorrecto) {
          lstProductosAgregados.push(objProductoAgregado);
        } else {
          break;
        }
      }
    } else if (this.vTipoProductoId == 2) {
      let lstSeriesIngresadas = $('input[name=txtNmrSerie]');
      for (let i = 0; i <= this.lstNmrSerie.length - 1; i++) {
        let objProductoAgregado = new EProductosListado();
        objProductoAgregado.TipoProductoTexto = this.lstTipoProducto.find(objTipoProducto => objTipoProducto.TipoProductoId == this.vTipoProductoId)?.TipoProductoDescripcion;
        objProductoAgregado.ProductoId = this.vProductoId
        objProductoAgregado.ProductoNombre = this.lstProducto.find(objProducto => objProducto.ProductoId == this.vProductoId)?.ProductoNombre;
        objProductoAgregado.ProductoCodigo = lstSeriesIngresadas[i].value;
        itemCorrecto = (objProductoAgregado.ProductoCodigo.trim().length > 0);
        if (itemCorrecto) {
          lstProductosAgregados.push(objProductoAgregado);
        } else {
          break;
        }
      }
    } else if (this.vTipoProductoId == 3) {
      if (this.seleccion == "C") {
        let lstICIDIngresados = $('input[name=txtChip]');
        for (let i = 0; i <= this.lstChip.length - 1; i++) {
          let objProductoAgregado = new EProductosListado();
          objProductoAgregado.TipoProductoTexto = this.lstTipoProducto.find(objTipoProducto => objTipoProducto.TipoProductoId == this.vTipoProductoId)?.TipoProductoDescripcion;
          objProductoAgregado.ProductoId = this.vProductoId
          objProductoAgregado.ProductoNombre = this.lstProducto.find(objProducto => objProducto.ProductoId == this.vProductoId)?.ProductoNombre;
          objProductoAgregado.ProductoCodigo = "89511016" + lstICIDIngresados[i].value;
          objProductoAgregado.TipoChip = "C";

          itemCorrecto = (objProductoAgregado.ProductoCodigo.trim().length == 18);
          if (itemCorrecto) {
            lstProductosAgregados.push(objProductoAgregado);
          } else {
            break;
          }
        }
      } else if (this.seleccion == "R") {
        if (this.desde?.value == undefined || this.hasta?.value==undefined || this.desde?.value.trim().length == 0 || this.hasta?.value.trim().length == 0) {
          itemCorrecto = false;
        } else {
          let objProductoAgregado = new EProductosListado();
          objProductoAgregado.TipoProductoTexto = this.lstTipoProducto.find(objTipoProducto => objTipoProducto.TipoProductoId == this.vTipoProductoId)?.TipoProductoDescripcion;
          objProductoAgregado.ProductoId = this.vProductoId
          objProductoAgregado.ProductoNombre = this.lstProducto.find(objProducto => objProducto.ProductoId == this.vProductoId)?.ProductoNombre;
          objProductoAgregado.ProductoCodigo = "";
          objProductoAgregado.TipoChip = "R";
          objProductoAgregado.Desde = "89511016" + this.desde?.value;
          objProductoAgregado.Hasta = "89511016" + this.hasta?.value;

          if (parseInt(objProductoAgregado.Desde) <= parseInt(objProductoAgregado.Hasta)) {
            itemCorrecto = (objProductoAgregado.Desde.trim().length > 0 && objProductoAgregado.Hasta.trim().length > 0);
            if (itemCorrecto) {
              lstProductosAgregados.push(objProductoAgregado);
            }
          } else {
            itemCorrecto = false;
          }          
        }
      }
    } else {
      this.mensajes.msgErrorMixin("Error", "No es una opción válida");
    }
    if (itemCorrecto) {
      this.matDialogRef.close(lstProductosAgregados);
    } else {
      this.mensajes.msgErrorMixin("Error", "Debe Ingresar Correctamente los Datos");
    }

  }

  generarCantidadChip() {
    this.lstChip = [];
    this.vTotalChip = parseInt(this.cantidadChip?.value);

    let i = 0;
    for (let i = 0; i < this.vTotalChip; i++) {
      this.lstChip.push("");
    }
  }


  get Producto() { return this.frmPrincipal.get('Producto') }
  get TipoProducto() { return this.frmPrincipal.get('TipoProducto') }
  get ProductoID() { return this.frmPrincipal.get('ProductoId') }
  get TipoProductoId() { return this.frmPrincipal.get('TipoProductoId') }
  get cantidadIMEI() { return this.frmPrincipal.get('cantidadIMEI') }
  get txtIMEI() { return this.frmPrincipal.get('txtIMEI') }
  get cantidadNmrSerie() { return this.frmPrincipal.get('cantidadNmrSerie') }
  get cantidadChip() { return this.frmPrincipal.get('cantidadChip') }
  get tipoChip() { return this.frmPrincipal.get('tipoChip') };
  get desde() { return this.frmPrincipal.get('desde') };
  get hasta() { return this.frmPrincipal.get('hasta') };
}

