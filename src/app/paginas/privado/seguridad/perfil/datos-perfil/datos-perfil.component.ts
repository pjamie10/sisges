import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EPerfil } from '../../../../../modelos/EPerfil';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { PerfilService } from '../../../../../servicios/perfil.service';


@Component({
  selector: 'app-datos-perfil',
  templateUrl: './datos-perfil.component.html',
  styleUrls: ['./datos-perfil.component.scss']
})
export class DatosPerfilComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objPerfil: EPerfil;
  vPerfilId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosPerfilComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private perfilService: PerfilService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      PerfilId: [0, Validators.compose([Validators.required])],
      PerfilDescripcion: ["", Validators.compose([Validators.required])],
      PerfilEstado: [null, Validators.required]
    });
    this.objPerfil = new EPerfil();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vPerfilId = data.PerfilId;
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vPerfilId > 0) {
      this.recuperarPerfil(this.vPerfilId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  guardarDatos(form: EPerfil) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objPerfil = new EPerfil();
        this.objPerfil = form;
        
        if (this.objPerfil.PerfilId == 0) {
          
          this.perfilService.insertarPerfil(this.objPerfil).subscribe((response) => {
            if (response.success) {
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              this.matDialogRef.close(response);
            }
            else {
              this.mensajes.msgError("No se pudo registrar el perfil");
            }
          },
            error => {
              this.mensajes.msgError("No se pudo registrar el perfil");
            });
        } else if (this.objPerfil.PerfilId > 0) {
          this.perfilService.modificarPerfil(this.objPerfil).subscribe((respuesta) => {
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

  recuperarPerfil(PerfilId: number) {
    this.perfilService.ObtenerPorId(PerfilId)
      .subscribe((response) => {
        if (response.success) {
          let objPerfil = new EPerfil();
          objPerfil = response.data;
          this.frmPrincipal.controls['PerfilId'].setValue(objPerfil.PerfilId);
          this.frmPrincipal.controls['PerfilDescripcion'].setValue(objPerfil.PerfilDescripcion);
          this.frmPrincipal.controls['PerfilEstado'].setValue(objPerfil.PerfilEstado);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
      },
        error => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        });
  }

  get PerfilDescripcion() { return this.frmPrincipal.get('PerfilDescripcion') }
  get PerfilEstado() { return this.frmPrincipal.get('PerfilEstado') }
}
