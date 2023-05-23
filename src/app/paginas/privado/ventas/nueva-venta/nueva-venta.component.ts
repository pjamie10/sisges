import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { error } from '@angular/compiler/src/util';
import { ErrorStateMatcher } from '@angular/material/core';
import { ECategoria } from '../../../../modelos/ECategoria';
import { EConjuntoDato } from '../../../../modelos/EConjuntoDato';
import { EModalidad } from '../../../../modelos/EModalidad';
import { CategoriaService } from '../../../../servicios/categoria.service';
import { ConjuntoDatoService } from '../../../../servicios/conjunto-dato.service';
import { ModalidadService } from '../../../../servicios/modalidad.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { ValidarControles } from '../../../../componentes/validar-controles';
import { AltaPostpagoComponent } from './alta-postpago/alta-postpago.component';
import { AltaPrepagoComponent } from './alta-prepago/alta-prepago.component';
import { PortaPostpagoComponent } from './porta-postpago/porta-postpago.component';
import { PortaPrepagoComponent } from './porta-prepago/porta-prepago.component';
import { RenoPostpagoComponent } from './reno-postpago/reno-postpago.component';
import { RenoPrepagoComponent } from './reno-prepago/reno-prepago.component';
import { PersonaEmpresaService } from '../../../../servicios/persona-empresa.service';
import { EUsuarioListado } from '../../../../modelos/EUsuario';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { EComprobanteVenta, EDetalleVenta, EVenta, EVentaListas } from '../../../../modelos/EVenta';
import { VentaService } from '../../../../servicios/venta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprobanteService } from '../../../../servicios/comprobante.service';
import { EComprobante } from '../../../../modelos/EComprobante';
import { DatePipe, Location } from '@angular/common';
import { EPersonaEmpresa } from '../../../../modelos/EPersonaEmpresa';
//import * as $ from 'jquery'
declare const $: any;
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.scss']
})
export class NuevaVentaComponent implements OnInit, AfterViewInit {
  @ViewChild(AltaPostpagoComponent) hijoAltaPost!: AltaPostpagoComponent;
  @ViewChild(AltaPrepagoComponent) hijoAltaPre!: AltaPrepagoComponent;
  @ViewChild(PortaPostpagoComponent) hijoPortaPost!: PortaPostpagoComponent;
  @ViewChild(PortaPrepagoComponent) hijoPortaPre!: PortaPrepagoComponent;
  @ViewChild(RenoPostpagoComponent) hijoRenoPost!: RenoPostpagoComponent;
  @ViewChild(RenoPrepagoComponent) hijoRenoPre!: RenoPrepagoComponent;

  lstModalidad: Array<EModalidad> = [];
  lstCategoria: Array<ECategoria> = [];
  lstTipoDocumentoIdentidad: Array<EConjuntoDato> = [];
  lstTipoComprobante: Array<EConjuntoDato> = [];
  lstComprobante: Array<EComprobante> = [];
  lstSexo: Array<EConjuntoDato> | undefined;
  frmVentas: FormGroup;
  formAltaPreValido: boolean = false;
  lstUsuario: Array<EUsuarioListado> | Array<EUsuarioListado>;
  lstUsuarioFiltro: Array<EUsuarioListado> | Array<EUsuarioListado>;
  numeroCaracteres: number = 0;

  mensajesValidacion = {
    'TipoDocumentoId': [
      { type: 'required', message: "El Tipo de Documento es Obligatorio." },
      { type: 'validarTipoDocumento', message: "El Tipo de Documento es es Obligatorio." }
    ],
    'TipoComprobanteId': [
      { type: 'validarTipoComprobante', message: "El Tipo de Comprobante es Obligatorio." }
    ],
    'ComprobanteId': [
      { type: 'validarComprobante', message: "El Tipo de Comprobante es Obligatorio." }
    ],
    'PersonaEmpresaNumeroDocumento':
      [
        { type: 'required', message: "El Número de Documento es Obligatorio" },
        { type: 'validarNumeroDocumento', message: "El Número de Digitos no es correcto" }
      ],
    'VentaSEC': [
      //{ type: 'required', message: 'El SEC es obligatorio.' },
      { type: 'maxlength', message: 'El SEC debe contener máximo 8 digitos.' },
      { type: 'pattern', message: 'El SEC sólo debe contener digitos.' },
      { type: 'validarSEC', message: 'El SEC debe contener 8 digitos.' }
    ]
  }

  categoriaSeleccionada: number = 0;
  modalidadSeleccionada: string | undefined = "";
  categoriaSeleccionadaTexto: string | undefined = "";
  modalidadSeleccionadatexto: string | undefined = "";
  tipoSeleccionado: string = "";
  tipoDocumentoIdentidad: string = "";
  tipoComprobanteSeleccionado: string = "00";
  serieComprobanteSeleccionado: number = 0;
  fechaActual: string | null = "";
  constructor(
    private formBuilder: FormBuilder,
    private modalidadService: ModalidadService,
    private categoriaService: CategoriaService,
    private conjuntoDatoService: ConjuntoDatoService,
    private mensajeService: MensajesService,
    private personaService: PersonaEmpresaService,
    private usuarioServie: UsuarioService,
    private ventaService: VentaService,
    private comprobanteService: ComprobanteService,
    private route: ActivatedRoute,
    private router: Router,
    private dp: DatePipe,
    public _location: Location
  ) {
    this.frmVentas = this.formBuilder.group({
      VentaId: [0, Validators.required],
      UsuarioRegistroId: [null, Validators.required],
      ClienteId: [null, Validators.required],
      AsesorId: [null, Validators.required],
      CategoriaId: [null, Validators.required],
      ModalidadId: [null, Validators.required],
      TipoCategoriaId: [null, Validators.required],
      VentaFecha: ["", Validators.required],
      VentaInicialTotal: [0, Validators.required],
      VentaRentaTotal: [0, Validators.required],
      VentaSubTotal: [0, Validators.required],
      VentaIGV: [0, Validators.required],
      VentaMontoFinal: [0, Validators.required],
      VentaEstado: ["", Validators.required],
      VentaSEC: ["", [Validators.maxLength(8), Validators.pattern('[0-9]*'), ValidarControles.validarSEC]],
      TipoComprobanteId: ["", ValidarControles.validarTipoComprobante],
      ComprobanteId: [0, ValidarControles.validarComprobante],
      ComprobanteSerie: ["", Validators.required],
      ComprobanteNumero: ["", Validators.required],
      PersonaEmpresaNumeroDocumento: ["", Validators.compose([Validators.required, ValidarControles.validarNumeroDocumento])],
      PersonaEmpresaSexo: ["", Validators.required],
      PersonaEmpresaFechaNacimiento: [null, Validators.compose([Validators.required])],
      PersonaEmpresaCelular: [null, Validators.compose([Validators.required])],
      PersonaEmpresaRazonSocial: ["", ValidarControles.validarRazonSocial],
      PersonaEmpresaNombre: ["", Validators.required],
      PersonaEmpresaApellidoPaterno: ["", Validators.required],
      PersonaEmpresaApellidoMaterno: ["", Validators.required],
      PersonaEmpresaDireccion: ["", Validators.required],
      TipoDocumentoId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoDocumento])],
    });
    this.lstUsuario = new Array<EUsuarioListado>();
    this.lstUsuario = [];
    this.lstUsuarioFiltro = new Array<EUsuarioListado>();
    this.lstUsuarioFiltro = [];
  }

  ngOnInit(): void {
    debugger;
    this.fechaActual = this.dp.transform(new Date(), 'yyyy-MM-dd');
    this.frmVentas.controls['VentaFecha'].setValue(this.fechaActual);
    this.listarSexo();

    this.cargarListas();
    // Code for the Validator
    const $validator = $('.card-wizard form').validate({
      rules: {
        Modalidad: {
          required: true
        }
      },
      highlight: function (element: any) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
      },
      success: function (element: any) {
        $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
      },
      errorPlacement: function (error: any, element: any) {
        $(element).append(error);
      }
    });
    // Wizard Initialization
    $('.card-wizard').bootstrapWizard({
      'tabClass': 'nav nav-pills',
      'nextSelector': '.btn-next',
      'previousSelector': '.btn-previous',
      onNext: function (tab: any, navigation: any, index: any) {
        debugger;
        let encontroCategoria = ($('input:radio[name=categoria]:checked').length == 1);
        let encontroModalidad = ($('input:radio[name=modalidad]:checked').length == 1);
        let encontroTipo = ($('input:radio[name=tipoVenta]:checked').length == 1);

        if (index == 1) {
          //let vCategoriaId = this.cate
          if (encontroCategoria) {
            if (encontroModalidad) {

              let categoria = $('input:radio[name=categoria]:checked')[0].value;
              //if (categoria == 3) {
              //  $('input:radio[value=E]').addClass('active');
              //  $('input:radio[value=E]').attr("checked", true);
              //}
              return true;

            } else {
              let objMensaje = new MensajesService();
              objMensaje.msgErrorInferiorDerecha("", "¡Debe Seleccionar la Modalidad!");
              //$validator.focusInvalid();
              return false;
            }
          } else {
            let objMensaje = new MensajesService();
            objMensaje.msgErrorInferiorDerecha("", "¡Debe Seleccionar la Categoria!");
            //$validator.focusInvalid();
            return false;
          }
        } else {
          if (!encontroTipo) {
            let objMensaje = new MensajesService();
            objMensaje.msgErrorInferiorDerecha("", "¡Debe Seleccionar el Tipo!");
            return false;
          } else {
            let categoria = $('input:radio[name=categoria]:checked')[0].value;
            let modalidad = $('input:radio[name=modalidad]:checked')[0].value;
            let tipoVenta = $('input:radio[name=tipoVenta]:checked')[0].value;
            //FALTARIA ENCONTRAR LA MANERA DE OBTENER EL CODIGO DE MODALIDAD: 01 ó 02
            if (categoria == 1 && modalidad == 3) {
              debugger;
              let validarAltaPost: boolean = ($('#validaAltaPost').val() == "true");
              if (validarAltaPost) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡Debe Completar los Campos Requeridos!");
                return false;
              }
            } else if (categoria == 1 && modalidad == 6) {
              let validaAltaPre: boolean = ($('#validaAltaPre').val() == "true");
              if (validaAltaPre) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡No se ha agregado ningun elemento para la venta!");
                return false;
              }
            } else if (categoria == 2 && modalidad == 3) {
              let validarPortaPost: boolean = ($('#validaPortaPost').val() == "true");
              if (validarPortaPost) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡No se ha agregado ningun elemento para la venta!");
                return false;
              }
            } else if (categoria == 2 && modalidad == 6) {
              let validarPortaPre: boolean = ($('#validaPortaPre').val() == "true");
              if (validarPortaPre) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡No se ha agregado ningun elemento para la venta!");
                return false;
              }
            } else if (categoria == 3 && modalidad == 3) {
              let validarRenoPost: boolean = ($('#validaRenoPost').val() == "true");
              if (validarRenoPost) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡No se ha agregado ningun elemento para la venta!");
                return false;
              }
            } else if (categoria == 3 && modalidad == 6) {
              let validarRenoPre: boolean = ($('#validaRenoPre').val() == "true");
              if (validarRenoPre) {
                return true;
              } else {
                let objMensaje = new MensajesService();
                objMensaje.msgErrorInferiorDerecha("", "¡No se ha agregado ningun elemento para la venta!");
                return false;
              }
            }
          }
        }
        return;
      },
      onPrevious: function (tab: any, navigation: any, index: any) {

      },
      onInit: function (tab: any, navigation: any, index: any) {

        // check number of tabs and fill the entire row
        let $total = navigation.find('li').length;
        let $wizard = navigation.closest('.card-wizard');

        let $first_li = navigation.find('li:first-child a').html();
        let $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
        $('.card-wizard .wizard-navigation').append($moving_div);

        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        let total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        let mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        let step_width = move_distance;
        move_distance = move_distance * index_temp;

        let $current = index + 1;

        if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
          move_distance -= 8;
        } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          let x: any = index / 2;
          vertical_level = parseInt(x);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });
        $('.moving-tab').css('transition', 'transform 0s');
      },
      onTabClick: function (tab: any, navigation: any, index: any) {
        let encontroCategoria = ($('input:radio[name=categoria]:checked').length == 1);
        let encontroModalidad = ($('input:radio[name=modalidad]:checked').length == 1);
        let encontroTipoVenta = ($('input:radio[name=tipoVenta]:checked').length == 1);

        if (encontroCategoria) {
          if (encontroModalidad) {
            return true;
          }
          else {
            let objMensaje = new MensajesService();
            objMensaje.msgErrorInferiorDerecha("", "¡Debe Seleccionar la Modalidad!");
            //$validator.focusInvalid();
            return false;
          }
        } else {
          let objMensaje = new MensajesService();
          objMensaje.msgErrorInferiorDerecha("", "¡Debe Seleccionar la Categoria!");
          //$validator.focusInvalid();
          return false;
        }
        return;
      },
      onTabShow: function (tab: any, navigation: any, index: any) {
        let $total = navigation.find('li').length;
        let $current = index + 1;

        const $wizard = navigation.closest('.card-wizard');

        // If it's the last tab then hide the last button and show the finish instead
        if ($current >= $total) {
          $($wizard).find('.btn-next').hide();
          $($wizard).find('.btn-finish').show();
        } else {
          $($wizard).find('.btn-next').show();
          $($wizard).find('.btn-finish').hide();
        }

        if ($current > 1) {
          $($wizard).find('.btn-salir').hide();
        } else {
          $($wizard).find('.btn-salir').show();
        }

        const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

        setTimeout(function () {
          $('.moving-tab').text(button_text);
        }, 150);

        const checkbox = $('.footer-checkbox');

        if (index !== 0) {
          $(checkbox).css({
            'opacity': '0',
            'visibility': 'hidden',
            'position': 'absolute'
          });
        } else {
          $(checkbox).css({
            'opacity': '1',
            'visibility': 'visible'
          });
        }
        $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        let total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        let mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        let step_width = move_distance;
        move_distance = move_distance * index_temp;

        $current = index + 1;

        if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
          move_distance -= 8;
        } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          let x: any = index / 2;
          vertical_level = parseInt(x);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

        });
      }
    });

    $('.set-full-height').css('height', 'auto');
  }

  listarSexo() {
    this.conjuntoDatoService.listarPorGrupo("SEXO")
      .subscribe((response: EConjuntoDato[] | []) => {
        this.lstSexo = response;
      });
  }

  retroceder() {

    this.router.navigate(['/ventas'], { relativeTo: this.route });
  }

  guardarVenta() {
    debugger;
    let vSerie = this.lstComprobante.find(x => x.ComprobanteId == this.serieComprobanteSeleccionado)?.ComprobanteSerie;
    this.ComprobanteSerie?.setValue(vSerie);
    this.VentaEstado?.setValue("A");
    this.UsuarioRegistroId?.setValue(1);
    //this.CategoriaId?.setValue(this.categoriaSeleccionada);
    //this.ModalidadId?.setValue(this.lstModalidad.find(elemento => elemento.ModalidadCodigo == this.modalidadSeleccionada)?.ModalidadId);
    if (this.frmVentas.valid) {
      let objVenta = new EVenta();
      debugger;
      let lstDetalleVenta = new Array<EDetalleVenta>();
      let objForm = null;
      let detalleValido = false;

      let vAltaPost = (this.categoriaSeleccionada == 1 && this.modalidadSeleccionada == "01");
      let vAltaPre = (this.categoriaSeleccionada == 1 && this.modalidadSeleccionada == "02")
      let vPortaPost = (this.categoriaSeleccionada == 2 && this.modalidadSeleccionada == "01");
      let vPortaPre = (this.categoriaSeleccionada == 2 && this.modalidadSeleccionada == "02");
      let vRenoPost = (this.categoriaSeleccionada == 3 && this.modalidadSeleccionada == "01");
      let vRenoPre = (this.categoriaSeleccionada == 3 && this.modalidadSeleccionada == "02");

      if (vAltaPost) {
        detalleValido = this.hijoAltaPost.lstDetalleVentaPostpago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoAltaPost.lstDetalleVentaPostpago
      } else if (vAltaPre) {
        detalleValido = this.hijoAltaPre.lstDetalleVentaPrepago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoAltaPre.lstDetalleVentaPrepago
      } else if (vPortaPost) {
        detalleValido = this.hijoPortaPost.lstDetalleVentaPostpago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoPortaPost.lstDetalleVentaPostpago
      } else if (vPortaPre) {
        detalleValido = this.hijoPortaPre?.lstDetalleVentaPrepago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoPortaPre.lstDetalleVentaPrepago
      } else if (vRenoPost) {
        detalleValido = this.hijoRenoPost?.lstDetalleVentaPostpago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoRenoPost.lstDetalleVentaPostpago
      } else if (vRenoPre) {
        detalleValido = this.hijoRenoPre?.lstDetalleVentaPrepago.length > 0;
        if (detalleValido) lstDetalleVenta = this.hijoRenoPre.lstDetalleVentaPrepago;
      }

      if (detalleValido) {
        objVenta = this.frmVentas.value;
        //DATOS DE COMPROBANTE
        objVenta.objComprobanteVenta = new EComprobanteVenta();
        objVenta.objComprobanteVenta.ComprobanteSerie = this.ComprobanteSerie?.value;
        objVenta.objComprobanteVenta.ComprobanteNumero = this.ComprobanteNumero?.value;
        objVenta.objComprobanteVenta.TipoComprobanteId = this.TipoComprobanteId?.value;
        objVenta.objComprobanteVenta.ComprobanteId = this.ComprobanteId?.value;
        objVenta.objComprobanteVenta.EstadoId = "00";
        objVenta.objComprobanteVenta.ComprobanteHash = "";
        objVenta.objComprobanteVenta.ComprobanteFecha = this.VentaFecha?.value;
        //DATOS DE PERSONA:
        if (objVenta.ClienteId == 0) {
          objVenta.objPersonaEmpresa = new EPersonaEmpresa();
          objVenta.objPersonaEmpresa.PersonaEmpresaId = 0;
          objVenta.objPersonaEmpresa.TipoDocumentoId = this.TipoDocumentoId?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaNombre = this.PersonaEmpresaNombre?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaFechaNacimiento = this.PersonaEmpresaFechaNacimiento?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaCelular = this.PersonaEmpresaCelular?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaSexo = this.PersonaEmpresaSexo?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaApellidoPaterno = this.PersonaEmpresaApellidoPaterno?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaApellidoMaterno = this.PersonaEmpresaApellidoMaterno?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaDireccion = this.PersonaEmpresaDireccion?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaEstado = "A";
          //objVenta.objPersonaEmpresa = this.frmVentas.value;

        } else {
          objVenta.objPersonaEmpresa = new EPersonaEmpresa();
          objVenta.objPersonaEmpresa.PersonaEmpresaId = objVenta.ClienteId;
          objVenta.objPersonaEmpresa.TipoDocumentoId = this.TipoDocumentoId?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaNombre = this.PersonaEmpresaNombre?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaCelular = this.PersonaEmpresaCelular?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaNombre = this.PersonaEmpresaNombre?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaFechaNacimiento = this.PersonaEmpresaFechaNacimiento?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaSexo = this.PersonaEmpresaSexo?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaApellidoPaterno = this.PersonaEmpresaApellidoPaterno?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaApellidoMaterno = this.PersonaEmpresaApellidoMaterno?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaDireccion = this.PersonaEmpresaDireccion?.value;
          objVenta.objPersonaEmpresa.PersonaEmpresaEstado = "A";
          debugger;
        }

        objVenta.lstDetalleVenta = lstDetalleVenta;

        this.mensajeService.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
          this.mensajeService.msgLoad("Procesando...");

          this.ventaService.insertarVenta(objVenta).subscribe((response: { success: boolean; }) => {
            if (response.success) {
              this.mensajeService.msgSuccess("VENTAS", "Venta Registrada Correctamente");
              /*this.router.navigate(['/venta']);*/
              location.reload();
            }
            else {
              this.mensajeService.msgError("No se pudo registrar la venta");
            }
          },
            (error: any) => {
              this.mensajeService.msgError("No se pudo registrar la venta");
            });
        });

      } else {
        this.mensajeService.msgError("No Existen Elementos Para Registrar la Venta");
      }

      debugger;


    } else {
      this.mensajeService.msgError("Es Necesario Completar los Datos");
      this.frmVentas.markAllAsTouched;
    }

  }

  cargarListas() {
    let fecha = new Date();
    let añoActual = fecha.getFullYear();
    this.mensajeService.msgLoad("Cargando...");
    this.ventaService.obtenerListas()
      .subscribe((response: { success: boolean; data: EVentaListas; }) => {
        if (response.success) {
          debugger;
          this.lstTipoComprobante = response.data.lstTipoComprobante;
          this.lstComprobante = response.data.lstComprobante;
          if (this.lstComprobante.length == 0) {
            this.mensajeService.msgAutoClose();
            this.mensajeService.msgError("No se encontraron comprobantes para el año " + añoActual);
          }
          this.lstUsuario = response.data.lstUsuarios;
          this.lstUsuarioFiltro = this.lstUsuario.slice();
          this.lstModalidad = response.data.lstModalidad;
          this.lstCategoria = response.data.lstCategoria;
          this.lstTipoDocumentoIdentidad = response.data.lstTipoDocumentoIdentidad;

          if (this.lstComprobante.length >= 0) {
            this.serieComprobanteSeleccionado = this.lstComprobante[0].ComprobanteId;
            this.ComprobanteNumero?.setValue(this.lstComprobante[0].ComprobanteNumero);
          }

          if (this.lstTipoDocumentoIdentidad.length >= 0) {
            let vTipoDocumentoId = this.lstTipoDocumentoIdentidad.find(x => x.ConjuntoDatoValor == "1")?.ConjuntoDatoValor;
            this.tipoDocumentoIdentidad = (vTipoDocumentoId != undefined) ? vTipoDocumentoId : "";
            this.numeroCaracteres = 8;
          }

        }
        else {
          this.mensajeService.msgError("No se pudieron cargar todas las listas");
        }
        this.mensajeService.msgAutoClose();
      },
        (error: any) => {
          this.mensajeService.msgError("No se pudieron cargar los registros");
        });
  }

  listarModalidad() {
    this.mensajeService.msgLoad("Cargando...");
    this.modalidadService.listarModalidad("")
      .subscribe((response: { success: boolean; data: Array<EModalidad>; }) => {
        if (response.success) {
          this.lstModalidad = response.data.filter((x: { ModalidadEstado: string; }) => x.ModalidadEstado == "A");
        }
        else {
          this.lstModalidad = [];
        }
        this.mensajeService.msgAutoClose();
      },
        (error: any) => {
          this.mensajeService.msgError("No se pudieron cargar los registros");
        });

  }

  listarCategoria() {
    this.mensajeService.msgLoad("Cargando...");
    this.categoriaService.listarCategoria("")
      .subscribe((response: { success: boolean; data: Array<ECategoria>; }) => {
        if (response.success)
          this.lstCategoria = response.data.filter((x: { CategoriaEstado: string; }) => x.CategoriaEstado == "A");
        else
          this.lstCategoria = [];
        this.mensajeService.msgAutoClose();
      },
        (error: any) => {
          this.mensajeService.msgError("No se pudieron cargar los registros");
        });
  }

  listarTipoDocumentoIdentidad() {
    this.conjuntoDatoService.listarPorGrupo("TIPO_DOCUMENTO")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoDocumentoIdentidad = response;
      });
  }

  listarTipoComprobante() {
    this.conjuntoDatoService.listarPorGrupo("TIPO_COMPROBANTE")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoComprobante = response.filter(x => x.ConjuntoDatoValor == "01" || x.ConjuntoDatoValor == "03" || x.ConjuntoDatoValor == "00").sort((a, b) => a.ConjuntoDatoValor.localeCompare(b.ConjuntoDatoValor));
      });
  }

  seleccionarModalidad(event: Event) {
    const wizard = $(event.currentTarget).closest('.card-wizard');
    wizard.find('[data-toggle="wizard-radio-modalidad"]').removeClass('active');
    $(event.currentTarget).addClass('active');
    $(wizard).find('[type="radio[name=modalidad]"]').removeAttr('checked');
    $(event.currentTarget).find('[type="radio"]').attr('checked', 'true');
    let modalidadId = $(event.currentTarget).find('[type="radio"]')[0].value;
    let objModalidad = this.lstModalidad.find(elemento => elemento.ModalidadId == modalidadId)
    this.modalidadSeleccionada = objModalidad?.ModalidadCodigo;
    this.modalidadSeleccionadatexto = objModalidad?.ModalidadNombre;
    //LIMPIAR SELECCION DE TIPO
    this.tipoSeleccionado = "";
    const wizardTipo = $(event.currentTarget).closest('.card-wizard');
    wizardTipo.find('[data-toggle="wizard-radio-tipo"]').removeClass('active');
    debugger;
    $("#radioChip").attr('checked', false);
    $("#radioEquipoChip").attr('checked', false);
    $("#radioEquipo").attr('checked', false);
    $(wizardTipo).find('[type="radio[name=tipoVenta]"]').removeAttr('checked');
    this.ModalidadId?.setValue(objModalidad?.ModalidadId);
  }

  seleccionarCategoria(event: Event) {

    const wizard = $(event.currentTarget).closest('.card-wizard');
    wizard.find('[data-toggle="wizard-radio-categoria"]').removeClass('active');
    $(event.currentTarget).addClass('active');
    $(wizard).find('[type="radio[name=categoria]"]').removeAttr('checked');
    $(event.currentTarget).find('[type="radio"]').attr('checked', 'true');
    this.categoriaSeleccionada = $(event.currentTarget).find('[type="radio"]')[0].value;
    this.categoriaSeleccionadaTexto = this.lstCategoria.find(elemento => elemento.CategoriaId == this.categoriaSeleccionada)?.CategoriaNombre;
    //ELIMINAR SELECCION DE TIPO:
    this.tipoSeleccionado = "";
    const wizardTipo = $(event.currentTarget).closest('.card-wizard');
    wizardTipo.find('[data-toggle="wizard-radio-tipo"]').removeClass('active');
    debugger;
    $("#radioChip").attr('checked', false);
    $("#radioEquipoChip").attr('checked', false);
    $("#radioEquipo").attr('checked', false);
    $(wizardTipo).find('[type="radio[name=tipoVenta]"]').removeAttr('checked');

    this.CategoriaId?.setValue(this.categoriaSeleccionada);
  }

  seleccionarTipo(event: Event, tipo: string) {
    debugger;
    //COMPLETAR ESTO.
    this.TipoCategoriaId?.setValue(tipo);
    if (this.categoriaSeleccionada == 1 && this.modalidadSeleccionada == "02") {
      if (this.hijoAltaPre != undefined) {
        this.hijoAltaPre?.frmAltaPrepagoChip.reset();
        this.hijoAltaPre?.frmAltaPrepagoChipEquipo.reset();
        this.hijoAltaPre.lstDetalleVentaPrepago = [];
      }
    }

    if (this.categoriaSeleccionada == 1 && this.modalidadSeleccionada == "01") {
      if (this.hijoAltaPost != undefined) {
        this.hijoAltaPost?.frmAltaPostpago.reset();
        this.hijoAltaPost?.frmAltaPostpagoEquipo.reset();
        this.hijoAltaPost.lstDetalleVentaPostpago = [];
      }
    }

    if (this.categoriaSeleccionada == 2 && this.modalidadSeleccionada == "02") {
      if (this.hijoPortaPre != undefined) {
        this.hijoPortaPre?.frmPortaPrepagoChip.reset();
        this.hijoPortaPre?.frmPortaPrepagoChipEquipo.reset();
        this.hijoPortaPre.lstDetalleVentaPrepago = [];
      }
    }

    if (this.categoriaSeleccionada == 2 && this.modalidadSeleccionada == "01") {
      if (this.hijoPortaPost != undefined) {
        this.hijoPortaPost?.frmPortaPostpagoChip.reset();
        this.hijoPortaPost?.frmPortaPostpagoChipEquipo.reset();
        this.hijoPortaPost.lstDetalleVentaPostpago = [];
      }
    }

    if (this.categoriaSeleccionada == 3 && this.modalidadSeleccionada == "02") {
      if (this.hijoRenoPre != undefined) {
        this.hijoRenoPre?.frmRenoPrepagoEquipo.reset();
        this.hijoRenoPre?.frmRenoPrepagoEquipoChip.reset();
        this.hijoRenoPre.lstDetalleVentaPrepago = [];
      }
    }

    if (this.categoriaSeleccionada == 3 && this.modalidadSeleccionada == "01") {
      if (this.hijoRenoPost != undefined) {
        this.hijoRenoPost?.frmRenoPostpagoEquipo.reset();
        this.hijoRenoPost?.frmRenoPostpagoEquipoChip.reset();
        this.hijoRenoPost.lstDetalleVentaPostpago = [];
      }
    }

    this.tipoSeleccionado = "";
    const wizard = $(event.currentTarget).closest('.card-wizard');
    wizard.find('[data-toggle="wizard-radio-tipo"]').removeClass('active');
    $("#radioChip").attr('checked', false);
    $("#radioEquipoChip").attr('checked', false);
    $("#radioEquipo").attr('checked', false);
    $(wizard).find('[type="radio[name=tipoVenta]"]').removeAttr('checked');
    $(event.currentTarget).addClass('active');
    $(event.currentTarget).find('[type="radio"]').attr('checked', 'true');
    this.tipoSeleccionado = $(event.currentTarget).find("input[name=tipoVenta]")[0].value;

    if (this.CategoriaId?.value == 1 && this.ModalidadId?.value == 6 && this.TipoCategoriaId?.value == 'C') {
      this.VentaSEC?.updateValueAndValidity();
    }
  }

  seleccionarTipoDocumentoIdentidad(TipoDocumentoId: string) {
    this.tipoDocumentoIdentidad = TipoDocumentoId;

    if (TipoDocumentoId == "1") {
      this.numeroCaracteres = 8;
    } else {
      this.numeroCaracteres = 11;
    }

    this.frmVentas.controls['PersonaEmpresaNumeroDocumento'].setValue("");
    this.frmVentas.controls['PersonaEmpresaNombre'].setValue("");
    this.frmVentas.controls['PersonaEmpresaApellidoPaterno'].setValue("");
    this.frmVentas.controls['PersonaEmpresaApellidoMaterno'].setValue("");
    this.frmVentas.controls['PersonaEmpresaDireccion'].setValue("");
    this.frmVentas.controls['PersonaEmpresaRazonSocial'].setValue("");

  }

  seleccionarTipoComprobante(tipoComprobanteId: string) {
    debugger;
    this.mensajeService.msgLoad("Cargando...");
    this.comprobanteService.listarComprobantePorTipo(tipoComprobanteId)
      .subscribe((response: { success: boolean; data: EComprobante[]; }) => {
        if (response.success) {
          debugger;
          this.lstComprobante = response.data;
          if (this.lstComprobante.length >= 0) {
            this.serieComprobanteSeleccionado = this.lstComprobante[0].ComprobanteId;
            this.ComprobanteNumero?.setValue(this.lstComprobante[0].ComprobanteNumero);
          }
          this.mensajeService.msgAutoClose();
        } else {
          this.lstComprobante = [];
          this.serieComprobanteSeleccionado = 0;
          this.ComprobanteNumero?.setValue("");
          this.mensajeService.msgAutoClose();
        }
      });
  }

  seleccionarSerieComprobante(ComprobanteId: string) {
    debugger;
    this.mensajeService.msgLoad("Cargando...");
    this.comprobanteService.listarComprobantePorId(ComprobanteId)
      .subscribe((response: { success: boolean; data: EComprobante; }) => {
        if (response.success) {
          debugger;
          this.ComprobanteNumero?.setValue(response.data.ComprobanteNumero);
          this.mensajeService.msgAutoClose();
        } else {
          this.ComprobanteNumero?.setValue("");
          this.mensajeService.msgAutoClose();
        }
      });
  }
  //BUSCAR PERSONA

  buscarPersonaPorTipoNumeroDocumento(event: KeyboardEvent, parametro: string) {
    debugger;

    if ((event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 13) || (event.keyCode >= 96 && event.keyCode <= 105)) {
      if (parametro.trim().length != this.numeroCaracteres)
        return false;

      let objUsuario = new EUsuarioListado();
      this.mensajeService.msgLoad("Buscando...");
      let TipoDocumento = this.TipoDocumentoId?.value;
      let numeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
      this.frmVentas.controls['ClienteId'].setValue(0);
      this.frmVentas.controls['PersonaEmpresaNombre'].setValue("");
      this.frmVentas.controls['PersonaEmpresaFechaNacimiento'].setValue("");
      this.frmVentas.controls['PersonaEmpresaCelular'].setValue("");
      this.frmVentas.controls['PersonaEmpresaSexo'].setValue("");
      this.frmVentas.controls['PersonaEmpresaApellidoPaterno'].setValue("");
      this.frmVentas.controls['PersonaEmpresaApellidoMaterno'].setValue("");
      this.frmVentas.controls['PersonaEmpresaDireccion'].setValue("");
      this.frmVentas.controls['PersonaEmpresaRazonSocial'].setValue("");
      this.personaService.buscarPersonaPorTipoNumeroDocumentoInterno(TipoDocumento, numeroDocumento)
        .subscribe((response: { success: boolean; data: EUsuarioListado; }) => {
          debugger;
          if (response.success) {
            this.frmVentas.controls['ClienteId'].setValue(response.data.PersonaEmpresaId);
            if (TipoDocumento == 1) {
              this.frmVentas.controls['PersonaEmpresaNombre'].setValue(response.data.PersonaEmpresaNombre);
              this.frmVentas.controls['PersonaEmpresaFechaNacimiento'].setValue(this.dp.transform(response.data.PersonaEmpresaFechaNacimiento, 'yyyy-MM-dd'));
              this.frmVentas.controls['PersonaEmpresaCelular'].setValue(response.data.PersonaEmpresaCelular);
              this.frmVentas.controls['PersonaEmpresaSexo'].setValue(response.data.PersonaEmpresaSexo);
              this.frmVentas.controls['PersonaEmpresaApellidoPaterno'].setValue(response.data.PersonaEmpresaApellidoPaterno);
              this.frmVentas.controls['PersonaEmpresaApellidoMaterno'].setValue(response.data.PersonaEmpresaApellidoMaterno);
              this.frmVentas.controls['PersonaEmpresaDireccion'].setValue(response.data.PersonaEmpresaDireccion);
            }
            else {
              this.frmVentas.controls['PersonaEmpresaRazonSocial'].setValue(response.data.PersonaEmpresaRazonSocial);
              this.frmVentas.controls['PersonaEmpresaDireccion'].setValue(response.data.PersonaEmpresaDireccion);
            }
            this.mensajeService.msgAutoClose();
          } else {
            debugger;
            this.personaService.buscarPersonaPorTipoNumeroDocumentoExterno(TipoDocumento, numeroDocumento)
              .subscribe((response: { success: boolean; data: EUsuarioListado; }) => {
                debugger;
                if (response.success) {
                  if (TipoDocumento == 1) {
                    this.frmVentas.controls['PersonaEmpresaNombre'].setValue(response.data.PersonaEmpresaNombre);
                    this.frmVentas.controls['PersonaEmpresaFechaNacimiento'].setValue(this.fechaActual);
                    this.frmVentas.controls['PersonaEmpresaApellidoPaterno'].setValue(response.data.PersonaEmpresaApellidoPaterno);
                    this.frmVentas.controls['PersonaEmpresaApellidoMaterno'].setValue(response.data.PersonaEmpresaApellidoMaterno);
                    this.frmVentas.controls['PersonaEmpresaDireccion'].setValue(response.data.PersonaEmpresaDireccion);
                  }
                  else {
                    this.frmVentas.controls['PersonaEmpresaRazonSocial'].setValue(response.data.PersonaEmpresaRazonSocial);
                    this.frmVentas.controls['PersonaEmpresaDireccion'].setValue(response.data.PersonaEmpresaDireccion);
                  }
                  this.mensajeService.msgAutoClose();
                } else {
                  this.mensajeService.msgError("No se encontro la persona");
                }
              })
          }
        },
          (error: any) => {
            this.mensajeService.msgError("Error al consultar");
          });
      return objUsuario;
    } else {
      return false;
    }
  }

  //LISTAR USUARIO

  listarUsuario(vParametro: string) {
    this.usuarioServie.listarUsuario(vParametro)
      .subscribe((response: { success: boolean; data: EUsuarioListado[]; }) => {
        if (response.success) {
          this.lstUsuario = response.data.filter((x: { UsuarioEstado: string; }) => x.UsuarioEstado == "A");
        }
        else {
          this.lstUsuario = [];
        }
      });
  }

  //-------VALIDACIONES:

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)?.valid && form.get(field)?.touched;
  }

  ngAfterViewInit() {
    $(window).resize(() => {
      $('.card-wizard').each(function () {
        const $wizard = $('.card-wizard');
        const index = $wizard.bootstrapWizard('currentIndex');
        let $total = $wizard.find('.nav li').length;
        let $li_width = 100 / $total;

        let total_steps = $wizard.find('.nav li').length;
        let move_distance = $wizard.width() / total_steps;
        let index_temp = index;
        let vertical_level = 0;

        let mobile_device = $(document).width() < 600 && $total > 3;

        if (mobile_device) {
          move_distance = $wizard.width() / 2;
          index_temp = index % 2;
          $li_width = 50;
        }

        $wizard.find('.nav li').css('width', $li_width + '%');

        let step_width = move_distance;
        move_distance = move_distance * index_temp;

        let $current = index + 1;

        if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
          move_distance -= 8;
        } else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
          move_distance += 8;
        }

        if (mobile_device) {
          let x: any = index / 2;
          vertical_level = parseInt(x);
          vertical_level = vertical_level * 38;
        }

        $wizard.find('.moving-tab').css('width', step_width);
        $('.moving-tab').css({
          'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
          'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
        });

        $('.moving-tab').css({
          'transition': 'transform 0s'
        });
      });
    });
  }

  get VentaId() { return this.frmVentas.get('VentaId') }
  get UsuarioRegistroId() { return this.frmVentas.get('UsuarioRegistroId') }
  get ClienteId() { return this.frmVentas.get('ClienteId') }
  get CategoriaId() { return this.frmVentas.get('CategoriaId') }
  get ModalidadId() { return this.frmVentas.get('ModalidadId') }
  get TipoCategoriaId() { return this.frmVentas.get('TipoCategoriaId') }
  get AsesorId() { return this.frmVentas.get('AsesorId') }
  get VentaFecha() { return this.frmVentas.get('VentaFecha') }
  get VentaInicialTotal() { return this.frmVentas.get('VentaInicialTotal') }
  get VentaRentaTotal() { return this.frmVentas.get('VentaRentaTotal') }
  get VentaSubTotal() { return this.frmVentas.get('VentaSubTotal') }
  get VentaIGV() { return this.frmVentas.get('VentaIGV') }
  get VentaMontoFinal() { return this.frmVentas.get('VentaMontoFinal') }
  get VentaEstado() { return this.frmVentas.get('VentaEstado') }
  get VentaSEC() { return this.frmVentas.get('VentaSEC') }

  get TipoComprobanteId() { return this.frmVentas.get('TipoComprobanteId') }
  get ComprobanteId() { return this.frmVentas.get('ComprobanteId') }
  get ComprobanteSerie() { return this.frmVentas.get('ComprobanteSerie') }
  get ComprobanteNumero() { return this.frmVentas.get('ComprobanteNumero') }

  get TipoDocumentoId() { return this.frmVentas.get('TipoDocumentoId') }
  get PersonaEmpresaNumeroDocumento() { return this.frmVentas.get('PersonaEmpresaNumeroDocumento') }
  get PersonaEmpresaRazonSocial() { return this.frmVentas.get('PersonaEmpresaRazonSocial') }
  get PersonaEmpresaNombre() { return this.frmVentas.get('PersonaEmpresaNombre') }
  get PersonaEmpresaFechaNacimiento() { return this.frmVentas.get('PersonaEmpresaFechaNacimiento') }
  get PersonaEmpresaCelular() { return this.frmVentas.get('PersonaEmpresaCelular') }
  get PersonaEmpresaSexo() { return this.frmVentas.get('PersonaEmpresaSexo') }
  get PersonaEmpresaApellidoPaterno() { return this.frmVentas.get('PersonaEmpresaApellidoPaterno') }
  get PersonaEmpresaApellidoMaterno() { return this.frmVentas.get('PersonaEmpresaApellidoMaterno') }
  get PersonaEmpresaDireccion() { return this.frmVentas.get('PersonaEmpresaDireccion') }
}
