import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EPersonaEmpresa } from '../../../../../modelos/EPersonaEmpresa';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { PersonaEmpresaService } from '../../../../../servicios/persona-empresa.service';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { EUsuarioListado } from '../../../../../modelos/EUsuario';
import { ValidarControles } from '../../../../../componentes/validar-controles';
//import {  MomentDateAdapter,  MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material";

@Component({
  selector: 'app-datos-persona',
  templateUrl: './datos-persona.component.html',
  styleUrls: ['./datos-persona.component.scss']
})
export class DatosPersonaComponent implements OnInit {

  lstSexo: Array<EConjuntoDato> | undefined;
  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined;
  lstTipoDocumentoIdentidad: Array<EConjuntoDato> | undefined;
  frmPrincipal: FormGroup;
  objPersona: EPersonaEmpresa;
  vPersonaId: number | 0;
  tipoDocumentoIdentidad: string = "";
  numeroCaracteres: number = 0;

  mensajesValidacion = {
    'TipoDocumento': [
      { type: 'required', message: "El Tipo de Documento es Obligatorio." },
      { type: 'validarTipoDocumento', message: "El Tipo de Documento es es Obligatorio." }
    ],
    'NumeroDocumento': [
      { type: 'required', message: "El Numero de Documento es Obligatorio." },
      { type: 'validarTipoDocumento', message: "El Numero de Documeno es Obligatorio." }
    ],
    'Grupo': [
      { type: 'required', message: "El Grupo es Obligatorio." },
      { type: 'validarGrupo', message: "El Grupo es Obligatorio." }
    ],
    'Perfil': [
      { message: "Debe Seleccionar un Perfil" },
    ],
    'Password': [
      { type: 'validarContraseña', message: "La contraseña debe tener al menos 6 caracteres" },
      { type: 'required', message: "La contraseña es olbigatorio" },
    ],
    'RtryPassword': [
      { type: 'required', message: "Las contraseñas deben coincidir." },
      { type: 'validarRepetirContraseña', message: "Las contraseñas deben coincidir." }
    ],
    'Login': [
      { type: 'validarContraseña', message: "El Nombre de usuario debe tener al menos 5 caracteres" },
      { type: 'required', message: "El Nombre de usuario es olbigatorio" },
    ],
    'PersonaEmpresaDireccion': [
      { type: 'required', message: "La dirección es obligatorio" },
    ],
    'PersonaEmpresaCelular': [
      { type: 'required', message: "El número de celular es obligatorio" },
    ],
    'PersonaEmpresaSexo': [
      { type: 'required', message: "El sexo es obligatorio" },
    ],
    'Estado': [
      { type: 'validarEstado', message: "El Estado es obligatorio." },
      { type: 'required', message: "El Estado es obligatorio." },
    ],
  }


  constructor(
    public matDialogRef: MatDialogRef<DatosPersonaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private personaService: PersonaEmpresaService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      PersonaEmpresaId: [0, Validators.compose([Validators.required])],
      TipoDocumentoId: [null, Validators.compose([Validators.required])],
      PersonaEmpresaNombre: ["", Validators.compose([Validators.required])],
      PersonaEmpresaApellidoPaterno: ["", Validators.compose([Validators.required])],
      PersonaEmpresaApellidoMaterno: ["", Validators.compose([Validators.required])],
      PersonaEmpresaNumeroDocumento: ["", Validators.compose([Validators.required])],
      PersonaEmpresaEstado: ["", Validators.compose([Validators.required, ValidarControles.validarEstado])],
      PersonaEmpresaDireccion: ["", Validators.compose([Validators.required])],
      PersonaEmpresaCelular: ["", Validators.compose([Validators.required, ValidarControles.validarNroCelular])],
      PersonaEmpresaFechaNacimiento: [null, Validators.compose([Validators.required])],
      PersonaEmpresaRazonSocial: [null],
      PersonaEmpresaCorreo: [null],
      PersonaEmpresaSexo: ["", Validators.required],
    });
    this.objPersona = new EPersonaEmpresa();
    this.titulo = data.titulo;
    this.vPersonaId = data.PersonaId;
    this.lstEstado = new Array<EConjuntoDato>();
    this.lstTipoDocumentoIdentidad = new Array<EConjuntoDato>();
  }

  ngOnInit(): void {
    this.listarEstado();
    this.listarTipoDocumentoIdentidad();
    if (this.vPersonaId > 0) {
      this.recuperarPersona(this.vPersonaId);
      this.PersonaEmpresaNumeroDocumento?.disable();
      this.TipoDocumentoId?.disable();
    }
    this.listarSexo();
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  listarTipoDocumentoIdentidad() {
    this.servConjuntoDato.listarPorGrupo("TIPO_DOCUMENTO")
      .subscribe(response => {
        this.lstTipoDocumentoIdentidad = response;
        if (this.lstTipoDocumentoIdentidad.length >= 0) {
          let vTipoDocumentoId = this.lstTipoDocumentoIdentidad.find(x => x.ConjuntoDatoValor == "1")?.ConjuntoDatoValor;
          this.tipoDocumentoIdentidad = (vTipoDocumentoId != undefined) ? vTipoDocumentoId : "";
          this.numeroCaracteres = 8;
        }
      });
  }


  filtroFecha = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  seleccionarTipoDocumentoIdentidad(TipoDocumentoId: string) {
    this.tipoDocumentoIdentidad = TipoDocumentoId;

    if (TipoDocumentoId == "1") {
      this.numeroCaracteres = 8;
    } else {
      this.numeroCaracteres = 11;
    }
  }

  guardarDatos(form: EPersonaEmpresa) {

    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objPersona = new EPersonaEmpresa();
        this.objPersona = form;
        form.PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
        form.TipoDocumentoId = this.TipoDocumentoId?.value;
        debugger;
        if (this.objPersona.PersonaEmpresaId == 0) {
          this.personaService.insertarPersona(this.objPersona).subscribe((response: { success: boolean; }) => {
            if (response.success) {
              //this.mensajes.msgSuccess("", "Datos Guardados Correctamente");
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              //Swal.fire("titulo", "Datos Guardados Correctamente", "success");
              //Swal.fire(undefined, "Datos Guardados Correctamente", "success");
              this.matDialogRef.close(response);
            }
            else {
              this.mensajes.msgError("No se pudo registrar la modalidad");
            }
          },
            error => {
              this.mensajes.msgError("No se pudo registrar la modalidad");
            });
        } else if (this.objPersona.PersonaEmpresaId > 0) {
          this.personaService.modificarPersona(this.objPersona).subscribe((respuesta: { success: boolean; }) => {
            if (respuesta.success) {
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              this.matDialogRef.close(respuesta);
            } else {
              this.mensajes.msgError("No se pudo guardar los datos");
            }
          },
            error => {
              this.mensajes.msgError("No se pudo guardar los datos");
            })
        }

      });
    }
    else {
      this.mensajes.msgError("Ingrese Todos Los Campos Obligatorios");
      this.frmPrincipal.markAsUntouched();
    }
  }

  recuperarPersona(PersonaEmpresaId: number) {
    debugger
    this.mensajes.msgLoad("Cargando...");
    this.personaService.ObtenerPorId(PersonaEmpresaId)
      .subscribe((response: { success: boolean; data: EPersonaEmpresa; }) => {
        debugger
        if (response.success) {
          let objPersona = new EPersonaEmpresa();
          debugger
          objPersona = response.data;
          this.frmPrincipal.controls['PersonaEmpresaId'].setValue(objPersona.PersonaEmpresaId);
          this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue(objPersona.PersonaEmpresaNombre);
          this.frmPrincipal.controls['PersonaEmpresaApellidoPaterno'].setValue(objPersona.PersonaEmpresaApellidoPaterno);
          this.frmPrincipal.controls['PersonaEmpresaApellidoMaterno'].setValue(objPersona.PersonaEmpresaApellidoMaterno);
          this.frmPrincipal.controls['PersonaEmpresaNumeroDocumento'].setValue(objPersona.PersonaEmpresaNumeroDocumento);
          this.frmPrincipal.controls['TipoDocumentoId'].setValue(objPersona.TipoDocumentoId);
          let fecha = moment(objPersona.PersonaEmpresaFechaNacimiento).format("yyyy-MM-DD");
          this.frmPrincipal.controls['PersonaEmpresaFechaNacimiento'].setValue(fecha);
          this.frmPrincipal.controls['PersonaEmpresaCelular'].setValue(objPersona.PersonaEmpresaCelular);
          this.frmPrincipal.controls['PersonaEmpresaDireccion'].setValue(objPersona.PersonaEmpresaDireccion);
          this.frmPrincipal.controls['PersonaEmpresaEstado'].setValue(objPersona.PersonaEmpresaEstado);
          this.frmPrincipal.controls['PersonaEmpresaRazonSocial'].setValue(objPersona.PersonaEmpresaRazonSocial);
          this.frmPrincipal.controls['PersonaEmpresaCorreo'].setValue(objPersona.PersonaEmpresaCorreo);
          this.frmPrincipal.controls['PersonaEmpresaSexo'].setValue(objPersona.PersonaEmpresaSexo.trim().substring(0, 1))
          this.mensajes.msgAutoClose();
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
      },
        (error: any) => {
          this.mensajes.msgError("No se pudo encontrar los datos");
        });
  }

  buscarPersonaPorTipoNumeroDocumento() {
    let TipoDocumentoId = this.TipoDocumentoId?.value;
    let PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
    this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue("");
    this.frmPrincipal.controls['PersonaEmpresaApellidoPaterno'].setValue("");
    this.frmPrincipal.controls['PersonaEmpresaApellidoMaterno'].setValue("");
    this.frmPrincipal.controls['PersonaEmpresaFechaNacimiento'].setValue("");
    this.frmPrincipal.controls['PersonaEmpresaSexo'].setValue("");
    this.mensajes.msgLoad("Buscando...");
    this.personaService.buscarPersonaPorTipoNumeroDocumentoInterno(TipoDocumentoId, PersonaEmpresaNumeroDocumento)
      .subscribe((response: { success: boolean; data: EUsuarioListado; }) => {
        if (response.success) {
          let objPersona = new EUsuarioListado();
          objPersona = response.data;
          let vPersonaId = objPersona.PersonaEmpresaId;
          debugger;
          if (vPersonaId != null) {
            this.mensajes.msgConfirm('El DNI ingresado ' + PersonaEmpresaNumeroDocumento + ' ya cuenta con registro :' + objPersona.PersonaEmpresaNombre +
              ' ' + objPersona.PersonaEmpresaApellidoPaterno + ' ' + objPersona.PersonaEmpresaApellidoMaterno + ' ' + ', ¿Deseas Editarlo?', () => {
                //LLAMAR AL COMPONENTE EDITAR
              this.titulo = "Modificar Persona";
              this.recuperarPersona(vPersonaId);
              });
          } else {
            this.titulo = "Registrar Persona";
            this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaApellidoPaterno'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaApellidoMaterno'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaNumeroDocumento'].setValue("");;
            this.frmPrincipal.controls['TipoDocumentoId'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaFechaNacimiento'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaCelular'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaDireccion'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaEstado'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaRazonSocial'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaCorreo'].setValue("");
            this.frmPrincipal.controls['PersonaEmpresaSexo'].setValue("");
            this.mensajes.msgAutoClose();
          }

        }
        else {
          this.titulo = "Registrar Persona";
          /*alert("llamar a RENIEC");*/
          this.personaService.buscarPersonaPorTipoNumeroDocumentoExterno(TipoDocumentoId, PersonaEmpresaNumeroDocumento)
            .subscribe((response: { success: boolean; data: EUsuarioListado; }) => {
              debugger;
              if (response.success) {
                let objPersona = new EUsuarioListado();
                objPersona = response.data;
                debugger;
                this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue(objPersona.PersonaEmpresaNombre);
                this.frmPrincipal.controls['PersonaEmpresaApellidoPaterno'].setValue(objPersona.PersonaEmpresaApellidoPaterno);
                this.frmPrincipal.controls['PersonaEmpresaApellidoMaterno'].setValue(objPersona.PersonaEmpresaApellidoMaterno);
                this.frmPrincipal.controls['PersonaEmpresaSexo'].setValue(objPersona.PersonaEmpresaSexo.trim().substring(0, 1));
                var hoy = objPersona.PersonaEmpresaFechaNacimiento;
                moment(hoy).format("L");                     // 16/02/2021
                ///*const hoy = Date.now();    */            // obtenemos la fecha actual
                //moment(hoy).format("YYYY-MM-DD hh:mm A"); // 2021-02-16 05:46 PM
                //moment(hoy).format("D MMMM YYYY");        // 16 Febrero 2021
                debugger;
                this.frmPrincipal.controls['PersonaEmpresaFechaNacimiento'].setValue(hoy);
                this.mensajes.msgAutoClose();
              } else {
                this.mensajes.msgError("No se encontro la persona");
              }
            })
        }
      },
        (error: any) => {
          this.mensajes.msgError("Error al consultar");
          this.mensajes.msgAutoClose();
        });
  }
  listarSexo() {
    this.servConjuntoDato.listarPorGrupo("SEXO")
      .subscribe((response: EConjuntoDato[] | []) => {
        this.lstSexo = response;
      });
  }

  get TipoDocumentoId() { return this.frmPrincipal.get('TipoDocumentoId') }
  get PersonaEmpresaId() { return this.frmPrincipal.get('PersonaEmpresaId') }
  get PersonaEmpresaNumeroDocumento() { return this.frmPrincipal.get('PersonaEmpresaNumeroDocumento') }
  get PersonaEmpresaNombre() { return this.frmPrincipal.get('PersonaEmpresaNombre') }
  get PersonaEmpresaApellidoPaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoPaterno') }
  get PersonaEmpresaApellidoMaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoMaterno') }
  get PersonaEmpresaSexo() { return this.frmPrincipal.get('PersonaEmpresaSexo') }
  get PersonaEmpresaDireccion() { return this.frmPrincipal.get('PersonaEmpresaDireccion') }
  get PersonaEmpresaCelular() { return this.frmPrincipal.get('PersonaEmpresaCelular') }
  get PersonaEmpresaFechaNacimiento() { return this.frmPrincipal.get('PersonaEmpresaFechaNacimiento') }
  get PersonaEmpresaEstado() { return this.frmPrincipal.get('PersonaEmpresaEstado') }
  get PersonaEmpresaRazonSocial() { return this.frmPrincipal.get('PersonaEmpresaRazonSocial') }
  get PersonaEmpresaCorreo() { return this.frmPrincipal.get('PersonaEmpresaCorreo') }

}
