import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-reno-postpago',
  templateUrl: './reno-postpago.component.html',
  styleUrls: ['./reno-postpago.component.scss']
})
export class RenoPostpagoComponent implements OnInit {
  objDetalleIngresoListado: EDetalleIngresoListado;
  @Input() tipoVenta: string | undefined = "";
  frmRenoPostpagoEquipo: FormGroup;
  frmRenoPostpagoEquipoChip: FormGroup;
  lstPlanes: Array<EPlanes>;
  lstTipoVentas: Array<EConjuntoDato> = [];
  lstDetalleVentaPostpago: Array<EDetalleVenta> = [];
  mensajesValidacion = {
    'ModalidadOrigen': [
      { type: 'required', message: "La Modalidad de Origen es Obligatorio." },
      { type: 'validarModalidad', message: "La Modalidad de Origen es Obligatorio." }
    ],
    'Planes': [
      { type: 'required', message: "El Plan es Obligatorio." },
      { type: 'validarPlanes', message: "El Plan es Obligatorio." }
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
    'Monto': [
      { type: 'validarMonto', message: "El monto es Obligatorio." }
    ],
    'Cuotas': [
      { type: 'validarCuotas', message: "El número de cuotas es Obligatorio." }
    ],
    'MontoCuota': [
      { type: 'validarMontoCuota', message: "El monto inicial es Obligatorio." }
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
    private mensajes: MensajesService
  ) {
    this.frmRenoPostpagoEquipo = this.formBuilder.group({
      Planes: [0, Validators.compose([Validators.required, ValidarControles.validarPlanes])],
      VentaNumeroCelular: ["", Validators.compose([Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]*'), ValidarControles.validarNroCelular])],
      Renta: [0, Validators.required],
      IMEI: ["", Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*'), ValidarControles.validarIMEI])],
      IMEIId: [0, Validators.compose([Validators.required, ValidarControles.validarExisteIMEI])],
      TipoVentaId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoVentas])],
      nombreEquipo: ["", Validators.required],
      Monto: ["", ValidarControles.validarMonto],
      Cuotas: ["", ValidarControles.validarCuotas],
      MontoCuota: ["", Validators.compose([Validators.required, ValidarControles.validarMontoCuota])],
      Inicial: [0, Validators.required],
    });
    this.frmRenoPostpagoEquipoChip = this.formBuilder.group({
      ICID: ["", Validators.compose([Validators.required, Validators.maxLength(18), Validators.pattern('[0-9]*'), ValidarControles.validarICID])],
      ExisteICID: [0, Validators.compose([Validators.required, ValidarControles.validarExisteICID])],
    });
    this.lstPlanes = new Array<EPlanes>();
    this.objDetalleIngresoListado = new EDetalleIngresoListado();
  }

  ngOnInit(): void {
    this.listarPlanes();
    this.listarTipoVentas();
  }

  seleccionarTipoVenta(tipoVentaId: string) {
    debugger;
    if (tipoVentaId == "01") {
      debugger;
      this.frmRenoPostpagoEquipo.controls['Cuotas'].setValue(0);
      this.frmRenoPostpagoEquipo.controls['MontoCuota'].setValue(0);
      this.frmRenoPostpagoEquipo.controls['Inicial'].setValue(0);
    }
  }

  agregarDetalle() {

    let validarContenido = true;

    if (this.lstDetalleVentaPostpago.filter(x => x.IMEIId == this.IMEIId?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El IMEI Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.lstDetalleVentaPostpago.filter(x => x.VentaNumeroCelular == this.VentaNumeroCelular?.value).length > 0) {
      validarContenido = false;
      this.mensajes.msgErrorInferiorDerecha("", "El Número Ingresado ya Existe en la Lista.");
    }

    if (validarContenido && this.tipoVenta == "EC") {
      if (this.lstDetalleVentaPostpago.filter(x => x.ICIDId == this.ExisteICID?.value).length > 0) {
        validarContenido = false;
        this.mensajes.msgErrorInferiorDerecha("", "El ICID Ingresado ya Existe en la Lista.");
      }
    }

    if (validarContenido) {
      if ((this.tipoVenta == "EC" && this.frmRenoPostpagoEquipoChip.valid) || (this.tipoVenta == "E" && this.frmRenoPostpagoEquipo.valid)) {
        let objDetalleVentaPostPago = new EDetalleVenta();
        debugger;
        objDetalleVentaPostPago.DetalleVentaEstado = "A";
        objDetalleVentaPostPago.IMEIId = this.IMEIId?.value;
        objDetalleVentaPostPago.IMEI = this.IMEI?.value;
        objDetalleVentaPostPago.ProductoNombre = this.nombreEquipo?.value;
        objDetalleVentaPostPago.VentaNumeroCelular = this.VentaNumeroCelular?.value;
        objDetalleVentaPostPago.PlanId = this.Planes?.value;
        let Plan = this.lstPlanes.find(x => x.PlanId == this.Planes?.value)?.PlanDescripcion;
        objDetalleVentaPostPago.Plan = (Plan == undefined) ? "" : Plan;
        objDetalleVentaPostPago.DetalleVentaRenta = this.Renta?.value;
        objDetalleVentaPostPago.DetalleVentaEstado = "A";
        let tipoVenta = this.lstTipoVentas.find(x => x.ConjuntoDatoValor == this.TipoVentaId?.value)?.ConjuntoDatoTexto;
        objDetalleVentaPostPago.TipoVenta = (tipoVenta == undefined) ? "" : tipoVenta;
        objDetalleVentaPostPago.TipoVentaId = this.TipoVentaId?.value;

        objDetalleVentaPostPago.DetalleVentaMontoTotal = this.Monto?.value;
        objDetalleVentaPostPago.DetalleVentaIGV = 0;
        objDetalleVentaPostPago.DetalleVentaSubTotal = this.Monto?.value;
        if (objDetalleVentaPostPago.TipoVentaId == "02") {
          objDetalleVentaPostPago.DetalleVentaInicial = this.Inicial?.value;
          objDetalleVentaPostPago.DetalleVentaMontoCuota = this.MontoCuota?.value;
          objDetalleVentaPostPago.DetalleVentaNroCuotas = this.Cuotas?.value;
        }
        if (this.tipoVenta == "EC") {
          objDetalleVentaPostPago.ICIDId = this.ExisteICID?.value;
          objDetalleVentaPostPago.ICID = this.ICID?.value;
        }
        this.lstDetalleVentaPostpago.push(objDetalleVentaPostPago);
        if (this.tipoVenta == "EC") {
          this.frmRenoPostpagoEquipoChip.reset();
          this.frmRenoPostpagoEquipo.reset();
        } else {
          this.frmRenoPostpagoEquipo.reset();
        }
      } else {
        if (this.tipoVenta == "EC") {
          this.frmRenoPostpagoEquipoChip.reset();
          this.frmRenoPostpagoEquipo.reset();
        } else {
          this.frmRenoPostpagoEquipo.reset();
        }
        this.mensajes.msgErrorInferiorDerecha("", "Debe Completar los Datos");
      }
    }
  }

  quitarDetalle(item: EDetalleVenta) {

    let vIndiceEliminado = -1;

    this.lstDetalleVentaPostpago.forEach((objItemEliminado) => {
      if (item == objItemEliminado) {
        vIndiceEliminado = this.lstDetalleVentaPostpago.indexOf(item);
        this.lstDetalleVentaPostpago.splice(vIndiceEliminado, 1); // 1 es la cantidad de elemento a eliminar
      }
      if (vIndiceEliminado >= 0) return;
    });
  }

  ObtenerProductoPorTipoCodigo(event: KeyboardEvent, TipoProductoId: number, Parametro: string) {
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
                this.frmRenoPostpagoEquipo.controls['nombreEquipo'].setValue(objProductoDetalleIngreso.ProductoNombre);
                this.frmRenoPostpagoEquipo.controls['IMEIId'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              } else if (TipoProductoId == 3) {
                debugger;
                this.frmRenoPostpagoEquipoChip.controls['ExisteICID'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              }
            } else if (objProductoDetalleIngreso.EquipoEstado == "V") {
              if (TipoProductoId == 1) {
                this.mensajes.msgError("El IMEI Ingresado ya fue vendido");
              } else if (TipoProductoId == 3) {
                this.mensajes.msgError("El ICID Ingresado ya fue vendido");
                this.frmRenoPostpagoEquipoChip.controls['ExisteICID'].setValue(0);
              }
            }
          } else {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("El IMEI Ingresado no Existe");
              this.frmRenoPostpagoEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("El ICID Ingresado no existe");
              this.frmRenoPostpagoEquipo.controls['ExisteICID'].setValue(0);
            }
          }
        },
          (error: any) => {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("Error al consultar el equipo");
              this.frmRenoPostpagoEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("Error al consultar el ICID");
              this.frmRenoPostpagoEquipoChip.controls['ICID'].setValue("");
              this.frmRenoPostpagoEquipoChip.controls['ExisteICID'].setValue(0);
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

  listarTipoVentas() {
    this.servConjuntoDato.listarPorGrupo("TIPO_VENTA")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoVentas = response;
      });
  }

  get Planes() { return this.frmRenoPostpagoEquipo.get("Planes") }
  get Renta() { return this.frmRenoPostpagoEquipo.get('Renta') }
  get Cuotas() { return this.frmRenoPostpagoEquipo.get('Cuotas') }
  get MontoCuota() { return this.frmRenoPostpagoEquipo.get('MontoCuota') }
  get Inicial() { return this.frmRenoPostpagoEquipo.get('Inicial') }
  get IMEI() { return this.frmRenoPostpagoEquipo.get('IMEI') }
  get IMEIId() { return this.frmRenoPostpagoEquipo.get('IMEIId') }
  get VentaNumeroCelular() { return this.frmRenoPostpagoEquipo.get('VentaNumeroCelular') }
  get TipoVentaId() { return this.frmRenoPostpagoEquipo.get('TipoVentaId') }
  get nombreEquipo() { return this.frmRenoPostpagoEquipo.get('nombreEquipo') }
  get Monto() { return this.frmRenoPostpagoEquipo.get('Monto') }
  get ICID() { return this.frmRenoPostpagoEquipoChip.get('ICID') }
  get ExisteICID() { return this.frmRenoPostpagoEquipoChip.get('ExisteICID') }
}
