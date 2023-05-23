import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EDetalleIngresoListado } from '../../../../../modelos/EIngreso';
import { EModalidad } from '../../../../../modelos/EModalidad';
import { EOperadores } from '../../../../../modelos/EOperadores';
import { EPlanes } from '../../../../../modelos/EPlanes';
import { EDetalleVenta } from '../../../../../modelos/EVenta';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ModalidadService } from '../../../../../servicios/modalidad.service';
import { OperadoresService } from '../../../../../servicios/operadores.service';
import { PlanesService } from '../../../../../servicios/planes.service';
import { ProductosService } from '../../../../../servicios/productos.service';

@Component({
  selector: 'app-porta-postpago',
  templateUrl: './porta-postpago.component.html',
  styleUrls: ['./porta-postpago.component.scss']
})
export class PortaPostpagoComponent implements OnInit {
  objDetalleIngresoListado: EDetalleIngresoListado;
  @Input() tipoVenta: string | undefined = "";
  frmPortaPostpagoChip: FormGroup;
  frmPortaPostpagoChipEquipo: FormGroup;
  lstOperadores: Array<EOperadores>;
  lstModalidad: Array<EModalidad>;
  lstPlanes: Array<EPlanes>;
  lstTipoVentas: Array<EConjuntoDato> = [];
  lstDetalleVentaPostpago: Array<EDetalleVenta> = [];
  mensajesValidacion = {
    'OperadorOrigen': [
      { type: 'required', message: "El Operador de Origen es Obligatorio." },
      { type: 'validarOperador', message: "El Operador de Origen es Obligatorio." }
    ],
    'ModalidadOrigen': [
      { type: 'required', message: "La Modalidad de Origen es Obligatorio." },
      { type: 'validarModalidad', message: "La Modalidad de Origen es Obligatorio." }
    ],
    'Planes': [
      { type: 'required', message: "El Plan es Obligatorio." },
      { type: 'validarPlanes', message: "El Plan es Obligatorio." }
    ],
    'Cuotas': [
      { type: 'validarCuotas', message: "El número de cuotas es Obligatorio." }
    ],
    'TipoVentas': [
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
    'MontoCuota': [
      { type: 'validarMontoCuota', message: "El monto inicial es Obligatorio." }
    ],
    'Monto': [
      { type: 'validarMonto', message: "Ingrese Correctamente el Valor del Monto del Equipo" }
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
    private servPlanes: PlanesService,
    private servConjuntoDato: ConjuntoDatoService,
    private productosService: ProductosService,
    private mensajes: MensajesService,
  ) {
    this.frmPortaPostpagoChip = this.formBuilder.group({
      ICID: ["", Validators.compose([Validators.required, Validators.maxLength(18), Validators.pattern('[0-9]*'), ValidarControles.validarICID])],
      ExisteICID: [0, Validators.compose([Validators.required, ValidarControles.validarExisteICID])],
      VentaNumeroCelular: ["", Validators.compose([Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]*'), ValidarControles.validarNroCelular])],
      OperadorOrigenId: [null, Validators.compose([Validators.required, ValidarControles.validarOperador])],
      ModalidadOrigenId: [null, Validators.compose([Validators.required, ValidarControles.validarModalidad])],
      Planes: [0, Validators.compose([Validators.required, ValidarControles.validarPlanes])],
      Renta: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      numeroDias: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]*'), ValidarControles.validarNumeroDias])],
    });
    this.frmPortaPostpagoChipEquipo = this.formBuilder.group({
      IMEI: ["", Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*'), ValidarControles.validarIMEI])],
      IMEIId: [0, Validators.compose([Validators.required, ValidarControles.validarExisteIMEI])],
      TipoVentaId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoVentas])],
      nombreEquipo: ["", Validators.required],
      Monto: [0, ValidarControles.validarMonto],
      Cuotas: ["", ValidarControles.validarCuotas],
      Inicial: [0],
      MontoCuota: ["", Validators.compose([Validators.required, ValidarControles.validarMontoCuota])]
    });
    this.lstOperadores = new Array<EOperadores>();
    this.lstModalidad = new Array<EModalidad>();
    this.lstPlanes = new Array<EPlanes>();
    this.objDetalleIngresoListado = new EDetalleIngresoListado();
  }

  ngOnInit(): void {
    this.listarOperadores();
    this.listarModalidad();
    this.listarPlanes();
    this.listarTipoVentas();
  }

  seleccionarTipoVenta(tipoVentaId: string) {
    debugger;
    if (tipoVentaId == "01") {
      debugger;
      this.frmPortaPostpagoChipEquipo.controls['Cuotas'].setValue(0);
      this.frmPortaPostpagoChipEquipo.controls['MontoCuota'].setValue(0);
      this.frmPortaPostpagoChipEquipo.controls['Inicial'].setValue(0);
    }
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
      if ((this.tipoVenta == "EC" && this.frmPortaPostpagoChipEquipo.valid) || (this.tipoVenta == "C" && this.frmPortaPostpagoChip.valid)) {
        let objDetalleVentaPostPago = new EDetalleVenta();

        objDetalleVentaPostPago.ICIDId = this.ExisteICID?.value;
        objDetalleVentaPostPago.ICID = this.ICID?.value;
        objDetalleVentaPostPago.VentaNumeroCelular = this.VentaNumeroCelular?.value;
        objDetalleVentaPostPago.PlanId = this.Planes?.value;
        let Plan = this.lstPlanes.find(x => x.PlanId == this.Planes?.value)?.PlanDescripcion;
        objDetalleVentaPostPago.Plan = (Plan == undefined) ? "" : Plan;
        debugger;
        objDetalleVentaPostPago.OperadorOrigenId = this.OperadorOrigenId?.value;
        let OperadorOrigen = this.lstOperadores.find(x => x.OperadorId == this.OperadorOrigenId?.value)?.OperadorDescripcion;
        objDetalleVentaPostPago.OperadorOrigenTexto = (OperadorOrigen == undefined) ? "" : OperadorOrigen;
        objDetalleVentaPostPago.ModalidadOrigenId = this.ModalidadOrigenId?.value;
        let ModalidadOrigen = this.lstModalidad.find(x => x.ModalidadId == this.ModalidadOrigenId?.value)?.ModalidadNombre;
        objDetalleVentaPostPago.ModalidadOrigenTexto = (ModalidadOrigen == undefined) ? "" : ModalidadOrigen;
        objDetalleVentaPostPago.DetalleVentaRenta = this.Renta?.value;
        objDetalleVentaPostPago.DetalleVentaEstado = "A";
        let tipoVenta = this.lstTipoVentas.find(x => x.ConjuntoDatoValor == this.TipoVentaId?.value)?.ConjuntoDatoTexto;
        objDetalleVentaPostPago.TipoVenta = (tipoVenta == undefined) ? "" : tipoVenta;
        //objDetalleVentaPostPago.TipoVentaId = this.TipoVentaId?.value;
        objDetalleVentaPostPago.DetalleVentaNroDias = this.numeroDias?.value;

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
          this.frmPortaPostpagoChipEquipo.reset();
          this.frmPortaPostpagoChip.reset();
        } else {
          this.frmPortaPostpagoChip.reset();
        }
      } else {
        if (this.tipoVenta == "EC") {
          this.frmPortaPostpagoChipEquipo.markAllAsTouched();
          this.frmPortaPostpagoChip.markAllAsTouched();
        } else {
          this.frmPortaPostpagoChip.markAllAsTouched();
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
              this.frmPortaPostpagoChipEquipo.controls['nombreEquipo'].setValue(objProductoDetalleIngreso.ProductoNombre);
              this.frmPortaPostpagoChipEquipo.controls['IMEIId'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
              this.mensajes.msgAutoClose();
            } else if (TipoProductoId == 3) {
              debugger;
              this.frmPortaPostpagoChip.controls['ExisteICID'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
              this.mensajes.msgAutoClose();
            }
          } else if (objProductoDetalleIngreso.EquipoEstado == "V") {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("El IMEI Ingresado ya fue vendido");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("El ICID Ingresado ya fue vendido");
              this.frmPortaPostpagoChip.controls['ExisteICID'].setValue(0);
            }
          }
        } else {
          if (TipoProductoId == 1) {
            this.mensajes.msgError("El IMEI Ingresado no Existe");
            this.frmPortaPostpagoChipEquipo.controls['nombreEquipo'].setValue("");
          } else if (TipoProductoId == 3) {
            this.mensajes.msgError("El ICID Ingresado no existe");
            this.frmPortaPostpagoChip.controls['ExisteICID'].setValue(0);
          }
        }
      },
        (error: any) => {
          if (TipoProductoId == 1) {
            this.mensajes.msgError("Error al consultar el equipo");
            this.frmPortaPostpagoChipEquipo.controls['nombreEquipo'].setValue("");
          } else if (TipoProductoId == 3) {
            this.mensajes.msgError("Error al consultar el ICID");
            this.frmPortaPostpagoChip.controls['ICID'].setValue("");
            this.frmPortaPostpagoChip.controls['ExisteICID'].setValue(0);
          }
        });
      return objProductoDetalleIngreso;
    } else {
      return false;
    }
  }

  listarOperadores() {
    
    this.servOperadores.listarOperadores("")
      .subscribe((response: { success: boolean; data: Array<EOperadores>; }) => {
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

  listarTipoVentas() {
    this.servConjuntoDato.listarPorGrupo("TIPO_VENTA")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoVentas = response;
      });
  }

  get OperadorOrigenId() { return this.frmPortaPostpagoChip.get("OperadorOrigenId") }
  get ModalidadOrigenId() { return this.frmPortaPostpagoChip.get("ModalidadOrigenId") }
  get Planes() { return this.frmPortaPostpagoChip.get("Planes") }
  get numeroDias() { return this.frmPortaPostpagoChip.get("numeroDias") }
  get Renta() { return this.frmPortaPostpagoChip.get("Renta") }
  get ICID() { return this.frmPortaPostpagoChip.get('ICID') }
  get ExisteICID() { return this.frmPortaPostpagoChip.get('ExisteICID') }
  get VentaNumeroCelular() { return this.frmPortaPostpagoChip.get('VentaNumeroCelular') }

  get IMEI() { return this.frmPortaPostpagoChipEquipo.get('IMEI') }
  get IMEIId() { return this.frmPortaPostpagoChipEquipo.get('IMEIId') }
  get Monto() { return this.frmPortaPostpagoChipEquipo.get('Monto') }
  get nombreEquipo() { return this.frmPortaPostpagoChipEquipo.get('nombreEquipo') }
  get TipoVentaId() { return this.frmPortaPostpagoChipEquipo.get('TipoVentaId') }
  get Cuotas() { return this.frmPortaPostpagoChipEquipo.get('Cuotas') }
  get Inicial() { return this.frmPortaPostpagoChipEquipo.get('Inicial') }
  get MontoCuota() { return this.frmPortaPostpagoChipEquipo.get('MontoCuota') }
}
