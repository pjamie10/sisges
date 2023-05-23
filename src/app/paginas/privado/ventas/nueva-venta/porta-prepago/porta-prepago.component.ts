import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EDetalleIngresoListado } from '../../../../../modelos/EIngreso';
import { EModalidad } from '../../../../../modelos/EModalidad';
import { EOperadores } from '../../../../../modelos/EOperadores';
import { EDetalleVenta } from '../../../../../modelos/EVenta';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ModalidadService } from '../../../../../servicios/modalidad.service';
import { OperadoresService } from '../../../../../servicios/operadores.service';
import { ProductosService } from '../../../../../servicios/productos.service';

@Component({
  selector: 'app-porta-prepago',
  templateUrl: './porta-prepago.component.html',
  styleUrls: ['./porta-prepago.component.scss']
})
export class PortaPrepagoComponent implements OnInit {
  objDetalleIngresoListado: EDetalleIngresoListado;
  @Input() tipoVenta: string | undefined = "";
  frmPortaPrepagoChip: FormGroup;
  frmPortaPrepagoChipEquipo: FormGroup;
  lstOperadores: Array<EOperadores>;
  lstModalidad: Array<EModalidad>;
  lstDetalleVentaPrepago: Array<EDetalleVenta> = [];
  mensajesValidacion = {
    'OperadorOrigen': [
      { type: 'required', message: "El Operador de Origen es Obligatorio." },
      { type: 'validarOperador', message: "El Operador de Origen es Obligatorio." }
    ],
        'ModalidadOrigen': [
      { type: 'required', message: "La Modalidad de Origen es Obligatorio." },
      { type: 'validarModalidad', message: "La Modalidad de Origen es Obligatorio." }
    ],
    'ICID': [
      { type: 'required', message: 'El ICID es obligatorio' },
      { type: 'maxlength', message: 'El ICID debe contener máximo 18 digitos.' },
      { type: 'pattern', message: 'El ICID sólo debe contener digitos.' },
      { type: 'validarICID', message: 'El ICID debe contener 18 digitos.' }
    ],
    'VentaNumeroCelular': [
      { type: 'required', message: 'El número asignado es obligatorio.' },
      { type: 'maxlength', message: 'El número asignado debe contener máximo 9 digitos.' },
      { type: 'pattern', message: 'El número asignado sólo debe contener digitos.' },
      { type: 'validarICID', message: 'El número asignado debe contener 9 digitos.' }
    ]
    ,
    'IMEI': [
      { type: 'required', message: 'El IMEI es obligatorio.' },
      { type: 'maxlength', message: 'El IMEI debe contener máximo 15 digitos.' },
      { type: 'pattern', message: 'El IMEI sólo debe contener digitos.' },
      { type: 'validarIMEI', message: 'El IMEI debe contener 15 digitos.' }
    ],
    'Monto': [
      { type: 'validarMonto', message: "El monto es Obligatorio." }
    ],
    'numeroDias': [
      { type: 'validarNumeroDias', message: "El número de días es Obligatorio." }
    ],
    'ExisteICID': [
      { type: 'validarExisteICID', message: "El ICID ingresado no existe." }
    ]
}

  constructor(
    private formBuilder: FormBuilder,
    private servOperadores: OperadoresService,
    private servModalidad: ModalidadService,
    private productosService: ProductosService,
    private mensajes: MensajesService
  ) {
    this.frmPortaPrepagoChip = this.formBuilder.group({
      OperadorOrigenId: [0, Validators.compose([Validators.required, ValidarControles.validarOperador])],
      ModalidadOrigenId: [0, Validators.compose([Validators.required, ValidarControles.validarModalidad])],
      ICID: ["", Validators.compose([Validators.required, Validators.maxLength(18), Validators.pattern('[0-9]*'), ValidarControles.validarICID])],
      ExisteICID: [0, Validators.compose([Validators.required, ValidarControles.validarExisteICID])],
      VentaNumeroCelular: ["", Validators.compose([Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]*'), ValidarControles.validarNroCelular])],
      numeroDias: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), ValidarControles.validarNumeroDias])]
    });
    this.frmPortaPrepagoChipEquipo = this.formBuilder.group({
      IMEI: ["", Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*'), ValidarControles.validarIMEI])],
      IMEIId: [0, Validators.compose([Validators.required, ValidarControles.validarExisteIMEI])],
      nombreEquipo: ["", Validators.required],
      Monto: ["", ValidarControles.validarMonto]
    });
    this.lstOperadores = new Array<EOperadores>();
    this.lstModalidad = new Array<EModalidad>();
    this.objDetalleIngresoListado = new EDetalleIngresoListado();
  }

  ngOnInit(): void {
    this.listarOperadores();
    this.listarModalidad();
  }

  agregarDetalle() {

    let validarContenido = true;

    if (this.lstDetalleVentaPrepago.filter(x => x.ICIDId == this.ExisteICID?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El ICID Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.lstDetalleVentaPrepago.filter(x => x.VentaNumeroCelular == this.VentaNumeroCelular?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El Número Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.tipoVenta == "EC") {
      if (this.lstDetalleVentaPrepago.filter(x => x.IMEIId == this.IMEIId?.value).length > 0) {
        validarContenido = false;
        this.mensajes.msgErrorInferiorDerecha("", "El IMEI Ingresado ya Existe en la Lista.");
      }
    }

    if (validarContenido) {
      if ((this.tipoVenta == "EC" && this.frmPortaPrepagoChipEquipo.valid) || (this.tipoVenta == "C" && this.frmPortaPrepagoChip.valid)) {
        let objDetalleVentaPrepago = new EDetalleVenta();

        objDetalleVentaPrepago.DetalleVentaEstado = "A";
        objDetalleVentaPrepago.TipoVentaId = "01";
        if (this.tipoVenta == "EC") {
         
          objDetalleVentaPrepago.DetalleVentaMontoTotal = this.Monto?.value;
          objDetalleVentaPrepago.DetalleVentaIGV = 0;
          objDetalleVentaPrepago.DetalleVentaSubTotal = this.Monto?.value;
          objDetalleVentaPrepago.IMEIId = this.IMEIId?.value;
          objDetalleVentaPrepago.IMEI = this.IMEI?.value;
          objDetalleVentaPrepago.ProductoNombre = this.nombreEquipo?.value;
        }
        objDetalleVentaPrepago.OperadorOrigenId = this.OperadorOrigenId?.value;
        let OperadorOrigen = this.lstOperadores.find(x => x.OperadorId == this.OperadorOrigenId?.value)?.OperadorDescripcion;
        objDetalleVentaPrepago.OperadorOrigenTexto = (OperadorOrigen == undefined) ? "" : OperadorOrigen;
        objDetalleVentaPrepago.ModalidadOrigenId = this.ModalidadOrigenId?.value;
        let ModalidadOrigen = this.lstModalidad.find(x => x.ModalidadId == this.ModalidadOrigenId?.value)?.ModalidadNombre;
        objDetalleVentaPrepago.ModalidadOrigenTexto = (ModalidadOrigen == undefined) ? "" : ModalidadOrigen;
        objDetalleVentaPrepago.DetalleVentaNroDias = this.numeroDias?.value;
        objDetalleVentaPrepago.ICIDId = this.ExisteICID?.value;
        objDetalleVentaPrepago.ICID = this.ICID?.value;
        objDetalleVentaPrepago.VentaNumeroCelular = this.VentaNumeroCelular?.value;

        this.lstDetalleVentaPrepago.push(objDetalleVentaPrepago);

        if (this.tipoVenta == "EC") {
          this.frmPortaPrepagoChipEquipo.reset();
          this.frmPortaPrepagoChip.reset();
        } else {
          this.frmPortaPrepagoChip.reset();
        }
      } else {
        if (this.tipoVenta == "EC") {
          this.frmPortaPrepagoChipEquipo.markAllAsTouched();
          this.frmPortaPrepagoChip.markAllAsTouched();
        } else {
          this.frmPortaPrepagoChip.markAllAsTouched();
        }
        this.mensajes.msgErrorInferiorDerecha("", "Debe Completar los Datos");
      }
    }
  }

  ObtenerProductoPorTipoCodigo(event: KeyboardEvent,TipoProductoId: number, Parametro: string) {
    debugger;
    if ((event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 13) || (event.keyCode >= 96 && event.keyCode <= 105)) {
    if (TipoProductoId == 3 && Parametro.trim().length != 18)
      return false;

    if (TipoProductoId == 1 && Parametro.trim().length != 15)
      return false;

    let objProductoDetalleIngreso = new EDetalleIngresoListado();
    this.mensajes.msgLoad("Buscando...");
    this.productosService.ObtenerPorCodigo(TipoProductoId, Parametro)
      .subscribe((response: { success: boolean; data: EDetalleIngresoListado; }) => {
        debugger;
        if (response.success) {
          objProductoDetalleIngreso = response.data;
          if (objProductoDetalleIngreso.EquipoEstado == "I") {
            if (TipoProductoId == 1) {
              this.frmPortaPrepagoChipEquipo.controls['nombreEquipo'].setValue(objProductoDetalleIngreso.ProductoNombre);
              this.frmPortaPrepagoChipEquipo.controls['IMEIId'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
              this.mensajes.msgAutoClose();
            } else if (TipoProductoId == 3) {
              debugger;
              this.frmPortaPrepagoChip.controls['ExisteICID'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
              this.mensajes.msgAutoClose();
            }
          } else if (objProductoDetalleIngreso.EquipoEstado == "V") {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("El IMEI Ingresado ya fue vendido");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("El ICID Ingresado ya fue vendido");
              this.frmPortaPrepagoChip.controls['ExisteICID'].setValue(0);
            }
          }
        } else {
          if (TipoProductoId == 1) {
            this.mensajes.msgError("El IMEI Ingresado no Existe");
            this.frmPortaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
          } else if (TipoProductoId == 3) {
            this.mensajes.msgError("El ICID Ingresado no existe");
            this.frmPortaPrepagoChip.controls['ExisteICID'].setValue(0);
          }
        }
      },
        (error: any) => {
          if (TipoProductoId == 1) {
            this.mensajes.msgError("Error al consultar el equipo");
            this.frmPortaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
          } else if (TipoProductoId == 3) {
            this.mensajes.msgError("Error al consultar el ICID");
            this.frmPortaPrepagoChip.controls['ICID'].setValue("");
            this.frmPortaPrepagoChip.controls['ExisteICID'].setValue(0);
          }
        });
    return objProductoDetalleIngreso;
  } else {
  return false;
}
  }

  listarOperadores() {
    
    this.servOperadores.listarOperadores("")
      .subscribe((response: { success: boolean; data: Array<EOperadores>;}) => {
      if (response.success) {
        this.lstOperadores = response.data.filter((x: { OperadorEstado: string; }) => x.OperadorEstado == "A");
      } else {
        this.lstOperadores = [];
      }

    })
  }

  listarModalidad() {
    
    this.servModalidad.listarModalidad("")
      .subscribe((response: { success: boolean; data: Array<EModalidad>; }) => {
        if (response.success) {
          this.lstModalidad = response.data.filter((x: { ModalidadEstado: string; }) => x.ModalidadEstado == "A");
        } else {
          this.lstModalidad = [];
        }

      })
  }




  get OperadorOrigenId() { return this.frmPortaPrepagoChip.get("OperadorOrigenId") }
  get ModalidadOrigenId() { return this.frmPortaPrepagoChip.get("ModalidadOrigenId") }
  get numeroDias() { return this.frmPortaPrepagoChip.get("numeroDias") }
  get ICID() { return this.frmPortaPrepagoChip.get('ICID') }
  get ExisteICID() { return this.frmPortaPrepagoChip.get('ExisteICID') }
  get IMEI() { return this.frmPortaPrepagoChipEquipo.get('IMEI') }
  get IMEIId() { return this.frmPortaPrepagoChipEquipo.get('IMEIId') }
  get nombreEquipo() { return this.frmPortaPrepagoChipEquipo.get('nombreEquipo') }
  get Monto() { return this.frmPortaPrepagoChipEquipo.get('Monto') }
  get VentaNumeroCelular() { return this.frmPortaPrepagoChip.get('VentaNumeroCelular') }
}
