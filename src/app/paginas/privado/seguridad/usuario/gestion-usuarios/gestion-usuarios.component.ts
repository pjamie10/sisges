import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as core from '@angular/core';
import * as forms from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EGrupo } from '../../../../../modelos/EGrupo';
import { EPerfil, EPerfilListado } from '../../../../../modelos/EPerfil';
import { EPersonaEmpresa } from '../../../../../modelos/EPersonaEmpresa';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { GrupoService } from '../../../../../servicios/grupo.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { PerfilService } from '../../../../../servicios/perfil.service';
import { PersonaEmpresaService } from '../../../../../servicios/persona-empresa.service';
import { EUsuarioListado } from '../../../../../modelos/EUsuario';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { UsuarioService } from '../../../../../servicios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined;
  lstSexo: Array<EConjuntoDato> | undefined;
  lstGrupo: Array<EGrupo>;
  lstPerfil: Array<EPerfil>;
  frmPrincipal: FormGroup;
  frmBusqueda: FormGroup;
  lstTipoDocumentoIdentidad: Array<EConjuntoDato> = [];
  objPersona: EPersonaEmpresa;
  vPerfilId: number | 0;
  vPerfilDescripcion: string = "";
  lstPerfilAgregados: Array<EPerfilListado>;
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
    'PersonaEmpresaCorreo': [
      { type: 'required', message: "El correo es obligatorio" },
    ],
    'PersonaEmpresaCelular': [
      { type: 'required', message: "El número de celular es obligatorio" },
    ],
    'PersonaEmpresaSexo': [
      { type: 'required', message: "El sexo es obligatorio" },
    ],
    'PersonaEmpresaEstado': [
      { type: 'validarEstado', message: "El estado es obligatorio" },
    ]
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servGrupo: GrupoService,
    private servPerfil: PerfilService,
    private mensajes: MensajesService,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private personaService: PersonaEmpresaService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      PersonaEmpresaId: [0, Validators.compose([Validators.required])],
      PersonaEmpresaNombre: ["", ValidarControles.validarNombres],
      PersonaEmpresaApellidoPaterno: ["", ValidarControles.validarApellidoPaterno],
      PersonaEmpresaApellidoMaterno: ["", ValidarControles.validarApellidoMaterno],
      PersonaEmpresaEstado: ["", Validators.compose([Validators.required, ValidarControles.validarEstado])],
      Grupo: [0, Validators.compose([Validators.required, ValidarControles.validarGrupo])],
      Perfil: [""],
      Login: ["", Validators.compose([Validators.required])],
      Password: ["", Validators.compose([Validators.required, ValidarControles.validarContraseña])],
      RtryPassword: ["", Validators.compose([Validators.required, ValidarControles.validarRepetirContraseña])],

      PersonaEmpresaDireccion: ["", Validators.compose([Validators.required, ValidarControles.validarDireccion])],
      PersonaEmpresaCelular: ["", Validators.compose([Validators.required, ValidarControles.validarNroCelular])],
      PersonaEmpresaCorreo: ["", Validators.compose([Validators.required, ValidarControles.validarCorreo, Validators.minLength(8)])],
      PersonaEmpresaFechaNacimiento: [null, Validators.compose([Validators.required, ValidarControles.validarFechaNacimiento])],
      PersonaEmpresaSexo: ["", Validators.required],
    });

    const ctrlNumeroDocumento = new FormControl("PersonaEmpresaNumeroDocumento");

    this.frmBusqueda = this.formBuilder.group({
      TipoDocumentoId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoDocumento])],
      PersonaEmpresaNumeroDocumento: ["", Validators.compose([Validators.required, ValidarControles.validarNumeroDocumento])],
    })

    this.titulo = "";
    this.lstEstado = new Array<EConjuntoDato>();
    this.vPerfilId = 0;
    this.vPerfilDescripcion = "";
    this.lstGrupo = new Array<EGrupo>();
    this.lstPerfil = new Array<EPerfil>();
    this.lstPerfilAgregados = new Array<EPerfilListado>();
    this.objPersona = new EPersonaEmpresa();

  }

  ngOnInit(): void {

    this.listarTipoDocumentoIdentidad();
    this.listarGrupo();
    this.listarPerfil();
    this.listarSexo();
    this.listarEstado();
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe((response: EConjuntoDato[] | []) => {
        this.lstEstado = response;
      });
  }

  listarGrupo() {
    this.servGrupo.listarGrupo("")
      .subscribe((response: { success: boolean; data: Array<EGrupo>; }) => {
        if (response.success) {
          this.lstGrupo = response.data;
        } else {
          this.lstGrupo = [];
        }
      })
  }

  listarSexo() {
    this.servConjuntoDato.listarPorGrupo("SEXO")
      .subscribe((response: EConjuntoDato[] | []) => {
        this.lstSexo = response;
      });
  }

  listarPerfil() {
    this.servPerfil.listarPerfil("")
      .subscribe((response: { success: boolean; data: Array<EPerfil>; }) => {
        if (response.success) {
          this.lstPerfil = response.data.filter((x: { PerfilEstado: string; }) => x.PerfilEstado == "A");
        } else {
          this.lstPerfil = [];
        }
      })
  }

  guardarDatos(form: EUsuarioListado) {
    debugger;
    if (this.frmPrincipal.valid) {
      form.lstPerfilUsuario = this.lstPerfilAgregados;
      form.PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
      form.PersonaEmpresaCorreo = this.PersonaEmpresaCorreo?.value;
      form.TipoDocumentoId = this.TipoDocumentoId?.value;
      form.UsuarioClave = this.Password?.value;
      form.UsuarioLogin = this.Login?.value;
      form.GrupoId = this.Grupo?.value;
      form.PersonaEmpresaEstado = this.PersonaEmpresaEstado?.value.trim().substring(0, 1);
      debugger;

      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.mensajes.msgLoad("Procesando...");
        this.usuarioService.insertarUsuario(form).subscribe((response: { success: boolean; }) => {
          if (response.success) {
            this.mensajes.msgSuccess("GESTIÓN DE USUARIOS", "Usuario Registrado Correctamente");
            this.router.navigate(['/seguridad/usuario'], { replaceUrl: true });
          }
          else {
            this.mensajes.msgError("No se pudo registrar el ingreso");
          }
        },
          (error: any) => {
            this.mensajes.msgError("No se pudo registrar el ingreso");
          });
      });
    }
    else {
      this.mensajes.msgError("Ingrese Todos Los Campos Obligatorios");
      this.frmPrincipal.markAsUntouched();
    }
  }

  addPerfil() {
    let objPerfil = new EPerfilListado();
    objPerfil.PerfilId = this.Perfil?.value;
    if (objPerfil.PerfilId.toString() != "") {
      let vPerfilDescripcion = this.lstPerfil.find(objPerfilLista => objPerfilLista.PerfilId === objPerfil.PerfilId)?.PerfilDescripcion;

      if (typeof vPerfilDescripcion == 'undefined') {
        objPerfil.PerfilDescripcion = "";
      } else {
        objPerfil.PerfilDescripcion = vPerfilDescripcion;
      }
      //Validamos que no haya un objeto repetido en la lista de Perfil Agregados
      let existe = this.lstPerfilAgregados.find(p => p.PerfilId === objPerfil.PerfilId)?.PerfilId;
      debugger;
      if (existe == undefined) {
        this.lstPerfilAgregados.push(objPerfil);
        this.Perfil?.setValue("");
      } else {
        this.mensajes.msgErrorInferiorDerecha('Seleccione otro perfil', "");
      }
    }
    else {
      this.mensajes.msgErrorInferiorDerecha('Debe seleccionar un perfil', "");
    }
  }

  seleccionarTipoDocumento(tipoDocumentoId: number) {
    this.PersonaEmpresaNumeroDocumento?.setValue("");
  }

  listarTipoDocumentoIdentidad() {
    this.servConjuntoDato.listarPorGrupo("TIPO_DOCUMENTO")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoDocumentoIdentidad = response.filter((x: { ConjuntoDatoValor: string; }) => x.ConjuntoDatoValor != "6");
        if (this.lstTipoDocumentoIdentidad.length >= 0) {
          let vTipoDocumentoId = this.lstTipoDocumentoIdentidad.find(x => x.ConjuntoDatoValor == "1")?.ConjuntoDatoValor;
          this.tipoDocumentoIdentidad = (vTipoDocumentoId != undefined) ? vTipoDocumentoId : "";
          this.numeroCaracteres = 8;
        }
      });
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
  seleccionarTipoDocumentoIdentidad(TipoDocumentoId: string) {
    debugger;
    this.tipoDocumentoIdentidad = TipoDocumentoId;

    if (TipoDocumentoId == "1") {
      this.numeroCaracteres = 8;
    } else {
      this.numeroCaracteres = 11;
    }
  }

  eliminarItem(objPerfil: EPerfilListado) {
    let vIndiceEliminado = -1;
    this.lstPerfilAgregados.forEach((objPerfilEliminado) => {
      if (objPerfil == objPerfilEliminado) {
        vIndiceEliminado = this.lstPerfilAgregados.indexOf(objPerfil);
        this.lstPerfilAgregados.splice(vIndiceEliminado, 1); // 1 es la cantidad de elemento a eliminar
      }
      if (vIndiceEliminado >= 0) return;
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
    this.personaService.buscarPersonaPorTipoNumeroDocumentoInterno(TipoDocumentoId, PersonaEmpresaNumeroDocumento)
      .subscribe((response: { success: boolean; data: EUsuarioListado; }) => {
        this.mensajes.msgLoad("Buscando...");
        debugger;
        if (response.success) {
          let objPersona = new EUsuarioListado();
          objPersona = response.data;
          let vPersonaId = objPersona.PersonaEmpresaId;
          let vUsuarioId = objPersona.UsuarioId;
          debugger;
          if (vUsuarioId != null) {
            this.mensajes.msgConfirm('El DNI ingresado ya cuenta con usuario: ' + objPersona.PersonaEmpresaNombre + ' ' + objPersona.PersonaEmpresaApellidoPaterno +
              ' ' + objPersona.PersonaEmpresaApellidoMaterno + ' (' + objPersona.UsuarioLogin + ')' + ', ¿Deseas Editarlo?', () => {
                //LLAMAR AL COMPONENTE EDITAR
              this.recuperarPersona(vPersonaId);
              });
          } else {
            this.frmPrincipal.controls['PersonaEmpresaId'].setValue(objPersona.PersonaEmpresaId);
            this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue(objPersona.PersonaEmpresaNombre);
            this.frmPrincipal.controls['PersonaEmpresaApellidoPaterno'].setValue(objPersona.PersonaEmpresaApellidoPaterno);
            this.frmPrincipal.controls['PersonaEmpresaApellidoMaterno'].setValue(objPersona.PersonaEmpresaApellidoMaterno);
            this.frmPrincipal.controls['PersonaEmpresaDireccion'].setValue(objPersona.PersonaEmpresaDireccion);
            this.frmPrincipal.controls['PersonaEmpresaCelular'].setValue(objPersona.PersonaEmpresaCelular);
            this.frmPrincipal.controls['PersonaEmpresaFechaNacimiento'].setValue(objPersona.PersonaEmpresaFechaNacimiento);
            this.frmPrincipal.controls['PersonaEmpresaSexo'].setValue(objPersona.PersonaEmpresaSexo.trim().substring(0, 1))
            this.mensajes.msgAutoClose();
          }
        }
        else {
          debugger;
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

  retroceder() {
    this.router.navigate(['/seguridad/usuario'], { replaceUrl: true });
  }

  get TipoDocumentoId() { return this.frmBusqueda.get('TipoDocumentoId') }
  get PersonaEmpresaNumeroDocumento() { return this.frmBusqueda.get('PersonaEmpresaNumeroDocumento') }
  get PersonaEmpresaNombre() { return this.frmPrincipal.get('PersonaEmpresaNombre') }
  get PersonaEmpresaApellidoPaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoPaterno') }
  get PersonaEmpresaApellidoMaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoMaterno') }
  get PersonaEmpresaDireccion() { return this.frmPrincipal.get('PersonaEmpresaDireccion') }
  get PersonaEmpresaCelular() { return this.frmPrincipal.get('PersonaEmpresaCelular') }
  get PersonaEmpresaCorreo() { return this.frmPrincipal.get('PersonaEmpresaCorreo') }
  get PersonaEmpresaSexo() { return this.frmPrincipal.get('PersonaEmpresaSexo') }
  get PersonaEmpresaFechaNacimiento() { return this.frmPrincipal.get('PersonaEmpresaFechaNacimiento') }
  get PersonaEmpresaEstado() { return this.frmPrincipal.get('PersonaEmpresaEstado') }
  get Password() { return this.frmPrincipal.get('Password') }
  get RtryPassword() { return this.frmPrincipal.get('RtryPassword') }
  get PerfilDescripcion() { return this.frmPrincipal.get('PerfilDescripcion') }
  get PerfilEstado() { return this.frmPrincipal.get('PerfilEstado') }
  get GrupoEstado() { return this.frmPrincipal.get('GrupoEstado') }
  get TipoDocumento() { return this.frmBusqueda.get('TipoDocumento') }
  get Grupo() { return this.frmPrincipal.get('Grupo') }
  get Login() { return this.frmPrincipal.get('Login') }
  get Perfil() { return this.frmPrincipal.get('Perfil') }
}
