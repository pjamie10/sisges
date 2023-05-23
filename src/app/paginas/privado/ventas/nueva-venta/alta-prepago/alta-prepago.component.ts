import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidarControles } from '../../../../../componentes/validar-controles'
import { EDetalleIngresoListado } from '../../../../../modelos/EIngreso';
import { EDetalleVenta } from '../../../../../modelos/EVenta';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ProductosService } from '../../../../../servicios/productos.service';


@Component({
  selector: 'app-alta-prepago',
  templateUrl: './alta-prepago.component.html',
  styleUrls: ['./alta-prepago.component.scss']
})
export class AltaPrepagoComponent implements OnInit {
  mensajesValidacion = {
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
    'ExisteICID': [
      { type: 'validarExisteICID', message: "El ICID ingresado no existe." }
    ]
  }

  @Input() tipoVenta: string | undefined = "";

  frmAltaPrepagoChip: FormGroup;
  frmAltaPrepagoChipEquipo: FormGroup;
  lstDetalleVentaPrepago: Array<EDetalleVenta> = [];
  constructor(
    private formBuilder: FormBuilder,
    private productosService: ProductosService,
    private mensajes: MensajesService,
  ) {
    this.frmAltaPrepagoChip = this.formBuilder.group({
      ICID: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*'), ValidarControles.validarICID])],
      ExisteICID: [0, Validators.compose([Validators.required, ValidarControles.validarExisteICID])],
      VentaNumeroCelular: ["", Validators.compose([Validators.required, Validators.maxLength(9), Validators.pattern('[0-9]*'), ValidarControles.validarNroCelular])]
    });
    this.frmAltaPrepagoChipEquipo = this.formBuilder.group({
      IMEI: ["", Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[0-9]*'), ValidarControles.validarIMEI])],
      IMEIId: [0, Validators.compose([Validators.required, ValidarControles.validarExisteIMEI])],
      nombreEquipo: ["", Validators.required],
      Monto: ["", ValidarControles.validarMonto]
    });
  }

  ngOnInit(): void {
    this.lstDetalleVentaPrepago = new Array<EDetalleVenta>();
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
      if ((this.tipoVenta == "EC" && this.frmAltaPrepagoChipEquipo.valid) || (this.tipoVenta == "C" && this.frmAltaPrepagoChip.valid)) {
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
        objDetalleVentaPrepago.ICIDId = this.ExisteICID?.value;
        objDetalleVentaPrepago.ICID = this.ICID?.value;
        objDetalleVentaPrepago.VentaNumeroCelular = this.VentaNumeroCelular?.value;

        this.lstDetalleVentaPrepago.push(objDetalleVentaPrepago);
        if (this.tipoVenta == "EC") {
          this.frmAltaPrepagoChipEquipo.reset();
          this.frmAltaPrepagoChip.reset();
        } else {
          this.frmAltaPrepagoChip.reset();
        }
      } else {
        if (this.tipoVenta == "EC") {
          this.frmAltaPrepagoChipEquipo.markAllAsTouched();
          this.frmAltaPrepagoChip.markAllAsTouched();
        } else {
          this.frmAltaPrepagoChip.markAllAsTouched();
        }
        this.mensajes.msgErrorInferiorDerecha("", "Debe Completar los Datos");
      }
    }


  
  }

  ObtenerProductoPorTipoCodigo(event: KeyboardEvent, TipoProductoId: number, Parametro: string) {
    debugger;
    //VALIDACION DE LO QUE SE PRESIONA
  /*  if (event.type == "keyup") event = KeyboardEvent event;*/

    if ((event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 13) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      if (TipoProductoId == 1 && Parametro.trim().length != 15) {
        this.frmAltaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
        return false;
      }

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
                this.frmAltaPrepagoChipEquipo.controls['nombreEquipo'].setValue(objProductoDetalleIngreso.ProductoNombre);
                this.frmAltaPrepagoChipEquipo.controls['IMEIId'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              } else if (TipoProductoId == 3) {
                debugger;
                this.frmAltaPrepagoChip.controls['ExisteICID'].setValue(objProductoDetalleIngreso.DetalleIngresoId);
                this.mensajes.msgAutoClose();
              }
            } else if (objProductoDetalleIngreso.EquipoEstado == "V") {
              if (TipoProductoId == 1) {
                this.mensajes.msgError("El IMEI Ingresado ya fue vendido");
                this.frmAltaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
                this.frmAltaPrepagoChipEquipo.controls['IMEIId'].setValue(0);
              } else if (TipoProductoId == 3) {
                this.mensajes.msgError("El ICID Ingresado ya fue vendido");
                this.frmAltaPrepagoChip.controls['ExisteICID'].setValue(0);
              }
            }
          } else {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("El IMEI Ingresado no Existe");
              this.frmAltaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("El ICID Ingresado no existe");
              this.frmAltaPrepagoChip.controls['ExisteICID'].setValue(0);
            }
          }
        },
          (error: any) => {
            if (TipoProductoId == 1) {
              this.mensajes.msgError("Error al consultar el equipo");
              this.frmAltaPrepagoChipEquipo.controls['nombreEquipo'].setValue("");
            } else if (TipoProductoId == 3) {
              this.mensajes.msgError("Error al consultar el ICID");
              this.frmAltaPrepagoChip.controls['ICID'].setValue("");
              this.frmAltaPrepagoChip.controls['ExisteICID'].setValue(0);
            }
          });
      return objProductoDetalleIngreso;
    } else {
      return false;
    }
  }

  get ICID() { return this.frmAltaPrepagoChip.get('ICID') }
  get ExisteICID() { return this.frmAltaPrepagoChip.get('ExisteICID') }
  get VentaNumeroCelular() { return this.frmAltaPrepagoChip.get('VentaNumeroCelular') }
  get IMEI() { return this.frmAltaPrepagoChipEquipo.get('IMEI') }
  get nombreEquipo() { return this.frmAltaPrepagoChipEquipo.get('nombreEquipo') }
  get Monto() { return this.frmAltaPrepagoChipEquipo.get('Monto') }
  get IMEIId() { return this.frmAltaPrepagoChipEquipo.get('IMEIId') }
}
