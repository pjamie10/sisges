import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EDetalleIngresoListado } from '../../../../../modelos/EIngreso';
import { EPlanes } from '../../../../../modelos/EPlanes';
import { EDetalleVenta } from '../../../../../modelos/EVenta';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { PlanesService } from '../../../../../servicios/planes.service';
import { ProductosService } from '../../../../../servicios/productos.service';

@Component({
  selector: 'app-alta-postpago',
  templateUrl: './alta-postpago.component.html',
  styleUrls: ['./alta-postpago.component.scss']
})
export class AltaPostpagoComponent implements OnInit {

  @Input() tipoVenta: string | undefined = "";

  frmAltaPostpago: FormGroup;
  frmAltaPostpagoEquipo: FormGroup;
  lstPlanes: Array<EPlanes>;
  lstTipoVentas: Array<EConjuntoDato> = [];
  lstDetalleVentaPostpago: Array<EDetalleVenta> = [];

  mensajesValidacion = {
    'Planes': [
      { type: 'required', message: "El Plan es Obligatorio." },
      { type: 'validarPlanes', message: "El Plan es Obligatorio." }
    ],
    'TipoVentaId': [
      { type: 'required', message: "Tipo de venta es Obligatorio." },
      { type: 'validarTipoVentas', message: "Tipo de venta es Obligatorio." }
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
      { type: 'validarMonto', message: "Ingrese Correctamente el Valor del Monto del Equipo." }
    ],
    'Cuotas': [
      { type: 'validarCuotas', message: "El número de cuotas es Obligatorio." }
    ],
    'MontoCuota': [
      { type: 'validarMontoCuota', message: "El monto inicial es Obligatorio." }
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
    private servPlanes: PlanesService,
    private servConjuntoDato: ConjuntoDatoService,
    private productosService: ProductosService,
    private mensajes: MensajesService,
  ) {
    this.frmAltaPostpago = this.formBuilder.group({
      Planes: [0, Validators.compose([Validators.required, ValidarControles.validarPlanes])],
      ICID: ["", Validators.compose([Validators.required, Validators.maxLength(18), Validators.pattern('[0-9]*'), ValidarControles.validarICID])],
      ExisteICID: [0, Validators.compose([Validators.required, ValidarControles.validarExisteICID])],
      VentaNumeroCelular: ["", Validators.compose([Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]*'), ValidarControles.validarNroCelular])],
      Renta: [0, Validators.required]

    });
    this.frmAltaPostpagoEquipo = this.formBuilder.group({
      IMEI: ["", Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*'), ValidarControles.validarIMEI])],
      IMEIId: [0, Validators.compose([Validators.required, ValidarControles.validarExisteIMEI])],
      TipoVentaId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoVentas])],
      nombreEquipo: ["", Validators.required],
      Monto: [0, ValidarControles.validarMonto],
      Cuotas: ["", ValidarControles.validarCuotas],
      Inicial: [0, Validators.required],
      MontoCuota: ["", Validators.compose([Validators.required, ValidarControles.validarMontoCuota])]
    });

    this.lstDetalleVentaPostpago = new Array<EDetalleVenta>();
    this.lstPlanes = new Array<EPlanes>();
  }

  ngOnInit(): void {
    this.listarPlanes();
    this.listarTipoVentas();

  }

  ObtenerProductoPorTipoCodigo(event: KeyboardEvent, TipoProductoId: number, Parametro: string) {
    debugger;

    if ((event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 13) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      if (TipoProductoId == 3 && Parametro.trim().length != 18)
        return false;

      if (TipoProductoId == 1 && Parametro.trim().length != 15)
        return false;

      let objProductoDetalleIngreso = new EDetalleIngresoListado();
      this.productosService.ObtenerPorCodigo(TipoProductoId, Parametro)
        .subscribe((response: { success: boolean; data: EDetalleIngresoListado; }) => {
          if (response.success) {
            debugger;
            objProductoDetalleIngreso = response.data;

            if (objProductoDetalleIngreso.EquipoEstado == "I") {
              if (TipoProductoId == 1) {
                this.frmAltaPostpagoEquipo.controls['nombreEquipo'].setValue(objProductoDetalleIngreso.ProductoNombre);
                this.frmAltaPostpagoEquipo.controls['IMEIId'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              } else if (TipoProductoId == 3) {
                this.frmAltaPostpago.controls['ExisteICID'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              }
            } else if (objProductoDetalleIngreso.EquipoEstado == "V") {
              if (TipoProductoId == 1) {
                this.mensajes.msgError("El IMEI Ingresado ya fue vendido");
              } else if (TipoProductoId == 3) {
                this.mensajes.msgError("El ICID Ingresado ya fue vendido");
                this.frmAltaPostpago.controls['ExisteICID'].setValue(0);
              }
            }
          } else {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("El IMEI Ingresado no Existe");
              this.frmAltaPostpagoEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("El ICID Ingresado no existe");
              this.frmAltaPostpago.controls['ExisteICID'].setValue(0);
            }
          }
        },
          (error: any) => {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("Error al consultar el equipo");
              this.frmAltaPostpagoEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("Error al consultar el ICID");
              this.frmAltaPostpago.controls['ICID'].setValue("");
              this.frmAltaPostpago.controls['ExisteICID'].setValue(0);
            }
          });
      return objProductoDetalleIngreso;
    } else {
      return false;
    }
  }

  listarPlanes() {
    this.servPlanes.listarPlanes("")
      .subscribe((response: { success: boolean; data: Array<EPlanes>; }) => {
        if (response.success) {
          this.lstPlanes = response.data.filter((x: { PlanEstado: string; }) => x.PlanEstado == "A");
        } else {
          this.lstPlanes = [];
        }
      })
  }

  agregarDetalle() {

    let validarContenido = true;

    if (this.lstDetalleVentaPostpago.filter(x => x.ICIDId == this.ExisteICID?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El ICID Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.lstDetalleVentaPostpago.filter(x => x.VentaNumeroCelular == this.VentaNumeroCelular?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El Número Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.tipoVenta == "EC") {
      if (this.lstDetalleVentaPostpago.filter(x => x.IMEIId == this.IMEIId?.value).length > 0) {
        validarContenido = false;
        this.mensajes.msgErrorInferiorDerecha("", "El IMEI Ingresado ya Existe en la Lista.");
      }
    }

    if (validarContenido) {
      if ((this.tipoVenta == "EC" && this.frmAltaPostpagoEquipo.valid) || (this.tipoVenta == "C" && this.frmAltaPostpago.valid)) {
        let objDetalleVentaPostPago = new EDetalleVenta();
        objDetalleVentaPostPago.ICIDId = this.ExisteICID?.value;
        objDetalleVentaPostPago.ICID = this.ICID?.value;
        objDetalleVentaPostPago.VentaNumeroCelular = this.VentaNumeroCelular?.value;
        debugger;
        objDetalleVentaPostPago.PlanId = this.Planes?.value;
        let Plan = this.lstPlanes.find(x => x.PlanId == this.Planes?.value)?.PlanDescripcion;
        objDetalleVentaPostPago.Plan = (Plan == undefined) ? "" : Plan;
        objDetalleVentaPostPago.DetalleVentaRenta = this.Renta?.value;
        objDetalleVentaPostPago.DetalleVentaEstado = "A";
        let tipoVenta = this.lstTipoVentas.find(x => x.ConjuntoDatoValor == this.TipoVentaId?.value)?.ConjuntoDatoTexto;
        objDetalleVentaPostPago.TipoVenta = (tipoVenta == undefined) ? "" : tipoVenta;
        if (this.tipoVenta == "C") {
          objDetalleVentaPostPago.TipoVentaId = "01";
        } else {
          objDetalleVentaPostPago.TipoVentaId = this.TipoVentaId?.value;
        }        

        if (this.tipoVenta == "EC") {
          if (objDetalleVentaPostPago.TipoVentaId == "02") {
            objDetalleVentaPostPago.DetalleVentaInicial = this.Inicial?.value;
            objDetalleVentaPostPago.DetalleVentaMontoCuota = this.MontoCuota?.value;
            objDetalleVentaPostPago.DetalleVentaNroCuotas = this.Cuotas?.value;
          }
          objDetalleVentaPostPago.DetalleVentaMontoTotal = this.Monto?.value;
          objDetalleVentaPostPago.DetalleVentaIGV = 0;
          objDetalleVentaPostPago.DetalleVentaSubTotal = this.Monto?.value;
          objDetalleVentaPostPago.IMEIId = this.IMEIId?.value;
          objDetalleVentaPostPago.IMEI = this.IMEI?.value;
          objDetalleVentaPostPago.ProductoNombre = this.nombreEquipo?.value;
        }
        this.lstDetalleVentaPostpago.push(objDetalleVentaPostPago);

        if (this.tipoVenta == "EC") {
          this.frmAltaPostpagoEquipo.reset();
          this.frmAltaPostpago.reset();
        } else {
          this.frmAltaPostpago.reset();
        }
      } else {
        if (this.tipoVenta == "EC") {
          this.frmAltaPostpagoEquipo.markAllAsTouched();
          this.frmAltaPostpago.markAllAsTouched();
        } else {
          this.frmAltaPostpago.markAllAsTouched();
        }
        this.mensajes.msgErrorInferiorDerecha("", "Debe Completar los Datos");
      }
    }
  }

  listarTipoVentas() {
    this.servConjuntoDato.listarPorGrupo("TIPO_VENTA")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoVentas = response;
      });
  }




  get Planes() { return this.frmAltaPostpago.get("Planes") }
  get ICID() { return this.frmAltaPostpago.get('ICID') }
  get Renta() { return this.frmAltaPostpago.get('Renta') }
  get IMEI() { return this.frmAltaPostpagoEquipo.get('IMEI') }
  get nombreEquipo() { return this.frmAltaPostpagoEquipo.get('nombreEquipo') }
  get Monto() { return this.frmAltaPostpagoEquipo.get('Monto') }
  get VentaNumeroCelular() { return this.frmAltaPostpago.get('VentaNumeroCelular') }
  get TipoVentaId() { return this.frmAltaPostpagoEquipo.get('TipoVentaId') }
  get Cuotas() { return this.frmAltaPostpagoEquipo.get('Cuotas') }
  get Inicial() { return this.frmAltaPostpagoEquipo.get('Inicial') }
  get MontoCuota() { return this.frmAltaPostpagoEquipo.get('MontoCuota') }
  get ExisteICID() { return this.frmAltaPostpago.get('ExisteICID') }
  get IMEIId() { return this.frmAltaPostpagoEquipo.get('IMEIId') }
}
