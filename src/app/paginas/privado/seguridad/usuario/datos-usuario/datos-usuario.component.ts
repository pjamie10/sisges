import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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


@Component({
  selector: 'app-datos-usuario',
  templateUrl: './datos-usuario.component.html',
  styleUrls: ['./datos-usuario.component.scss']
})
export class DatosUsuarioComponent implements OnInit {
  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  lstGrupo: Array<EGrupo>;
  lstPerfil: Array<EPerfil>;
  frmPrincipal: FormGroup;
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
    'Grupo': [
      { type: 'required', message: "El Grupo es Obligatorio." },
      { type: 'validarGrupo', message: "El Grupo es Obligatorio." }
    ]

  }
  constructor(
    public matDialogRef: MatDialogRef<DatosUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servGrupo: GrupoService,
    private servPerfil: PerfilService,
    private mensajes: MensajesService,
    private perfilService: PerfilService,
    private personaService: PersonaEmpresaService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      TipoDocumentoId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoDocumento])],
      PersonaEmpresaNumeroDocumento: ["", Validators.compose([Validators.required])],
      PerfilId: [0, Validators.compose([Validators.required])],
      PerfilDescripcion: ["", Validators.compose([Validators.required])],
      PerfilEstado: [null, Validators.required],
      Grupo: [0, Validators.compose([Validators.required, ValidarControles.validarGrupo])],
      Login: ["", Validators.compose([Validators.required])],
    });
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vPerfilId = data.PerfilId;
    this.vPerfilDescripcion = data.PerfilDescripcion;
    this.lstGrupo = new Array<EGrupo>();
    this.lstPerfil = new Array<EPerfil>();
    this.lstPerfilAgregados = new Array<EPerfilListado>();
    this.objPersona = new EPersonaEmpresa();

  }

  ngOnInit(): void {
    
    this.listarTipoDocumentoIdentidad();
    this.listarGrupo();
    this.listarPerfil();
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

  guardarDatos(form: EPerfil) {

  }

  añadirPerfil() {

  }

  listarTipoDocumentoIdentidad() {
    this.servConjuntoDato.listarPorGrupo("TIPO_DOCUMENTO")
      .subscribe((response: EConjuntoDato[]) => {
        this.lstTipoDocumentoIdentidad = response;
        Set
      });
    debugger;

    if (this.lstTipoDocumentoIdentidad.length >= 0) {
      let vTipoDocumentoId = this.lstTipoDocumentoIdentidad.find(x => x.ConjuntoDatoValor == "1")?.ConjuntoDatoValor;
      this.tipoDocumentoIdentidad = (vTipoDocumentoId != undefined) ? vTipoDocumentoId : "";
      this.numeroCaracteres = 8;
    }
  }
   
  guardarPerfil() {
    
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

  buscarPersonaPorTipoNumeroDocumento() {
    let TipoDocumentoId = this.TipoDocumentoId?.value;
    let PersonaEmpresaNumeroDocumento = this.PersonaEmpresaNumeroDocumento?.value;
    this.personaService.buscarPersonaPorTipoNumeroDocumentoInterno(TipoDocumentoId, PersonaEmpresaNumeroDocumento)
      .subscribe((response: { success: boolean; data: EPersonaEmpresa; }) => {
        if (response.success) {
          let objPersona = new EPersonaEmpresa();
          objPersona = response.data;
          this.frmPrincipal.controls['PersonaId'].setValue(objPersona.PersonaEmpresaId);
          this.frmPrincipal.controls['PersonaEmpresaNombre'].setValue(objPersona.PersonaEmpresaNombre);
          this.frmPrincipal.controls['PersonaApellidoPaterno'].setValue(objPersona.PersonaEmpresaApellidoPaterno);
          this.frmPrincipal.controls['PersonaApellidoMaterno'].setValue(objPersona.PersonaEmpresaApellidoMaterno);
          this.frmPrincipal.controls['PersonaNumeroDocumento'].setValue(objPersona.PersonaEmpresaNumeroDocumento);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
      },
          (error: any) => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        });
  }

  get TipoDocumentoId() { return this.frmPrincipal.get('TipoDocumentoId') }
  get PersonaEmpresaNumeroDocumento() { return this.frmPrincipal.get('PersonaEmpresaNumeroDocumento') }
  get PersonaEmpresaNombre() { return this.frmPrincipal.get('PersonaEmpresaNombre') }
  get PersonaEmpresaApellidoPaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoPaterno') }
  get PersonaEmpresaApellidoMaterno() { return this.frmPrincipal.get('PersonaEmpresaApellidoMaterno') }
  get PerfilDescripcion() { return this.frmPrincipal.get('PerfilDescripcion') }
  get PerfilEstado() { return this.frmPrincipal.get('PerfilEstado') }
  get GrupoEstado() { return this.frmPrincipal.get('GrupoEstado') }
  get TipoDocumento() { return this.frmPrincipal.get('TipoDocumento') }
  get Grupo() { return this.frmPrincipal.get('Grupo') }
  get Login() { return this.frmPrincipal.get('Login') }
}
