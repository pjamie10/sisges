import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EGrupo } from '../../../../../modelos/EGrupo';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { GrupoService } from '../../../../../servicios/grupo.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

@Component({
  selector: 'app-datos-grupo',
  templateUrl: './datos-grupo.component.html',
  styleUrls: ['./datos-grupo.component.scss']
})
export class DatosGrupoComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objGrupo: EGrupo;
  vGrupoId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosGrupoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private grupoService: GrupoService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      GrupoId: [0, Validators.compose([Validators.required])],
      GrupoDescripcion: ["", Validators.compose([Validators.required])],
      GrupoEstado: [null, Validators.required]
    });
    this.titulo = data.titulo;
    this.vGrupoId = data.GrupoId;
    this.objGrupo = new EGrupo();
    this.lstEstado = new Array<EConjuntoDato>();
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vGrupoId > 0) {
      this.recuperarGrupo(this.vGrupoId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe((response: Array<EConjuntoDato>) => {
        
        this.lstEstado = response;
      });
  }

  guardarDatos(form: EGrupo) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objGrupo = new EGrupo();
        this.objGrupo = form;

        if (this.objGrupo.GrupoId == 0) {
          this.grupoService.insertarGrupo(this.objGrupo).subscribe((response: { success: boolean; }) => {
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
            (error: any) => {
              this.mensajes.msgError("No se pudo registrar la modalidad");
            });
        } else if (this.objGrupo.GrupoId > 0) {
          this.grupoService.modificarGrupo(this.objGrupo).subscribe((respuesta: { success: boolean; }) => {
            if (respuesta.success) {
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              this.matDialogRef.close(respuesta);
            } else {
              this.mensajes.msgError("No se pudo guardar los datos");
            }
          },
            (error: any) => {
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

  recuperarGrupo(GrupoId: number) {
    this.grupoService.ObtenerPorId(GrupoId)
      .subscribe((response: { success: boolean; data: EGrupo; }) => {
        if (response.success) {
          let objGrupo = new EGrupo();
          objGrupo = response.data;
          this.GrupoId?.setValue(objGrupo.GrupoId);
          this.GrupoDescripcion?.setValue(objGrupo.GrupoDescripcion);
          this.GrupoEstado?.setValue(objGrupo.GrupoEstado);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
      },
        (error: any) => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        });
  }

  get GrupoId() { return this.frmPrincipal.get('GrupoId') }
  get GrupoDescripcion() { return this.frmPrincipal.get('GrupoDescripcion') }
  get GrupoEstado() { return this.frmPrincipal.get('GrupoEstado') }

}
