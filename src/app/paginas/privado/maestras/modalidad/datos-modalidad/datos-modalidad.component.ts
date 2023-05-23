import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EModalidad } from '../../../../../modelos/EModalidad';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ModalidadService } from '../../../../../servicios/modalidad.service';

@Component({
  selector: 'app-datos-modalidad',
  templateUrl: './datos-modalidad.component.html',
  styleUrls: ['./datos-modalidad.component.scss']
})
export class DatosModalidadComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objModalidad: EModalidad;
  vModalidadId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosModalidadComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private modalidadService: ModalidadService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      ModalidadId: [0, Validators.compose([Validators.required])],
      ModalidadCodigo: ["", Validators.compose([Validators.required])],
      ModalidadNombre: ["", Validators.compose([Validators.required])],
      ModalidadEstado: [null, Validators.required]
    });
    this.titulo = data.titulo;
    this.vModalidadId = data.ModalidadId;
    this.objModalidad = new EModalidad();
    this.lstEstado = new Array<EConjuntoDato>();
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vModalidadId > 0) {
      this.recuperarModalidad(this.vModalidadId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe((response: Array<EConjuntoDato>) => {
        
        this.lstEstado = response;
      });
  }

  guardarDatos(form: EModalidad) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objModalidad = new EModalidad();
        this.objModalidad = form;

        if (this.objModalidad.ModalidadId == 0) {
          this.modalidadService.insertarModalidad(this.objModalidad).subscribe((response: { success: boolean; }) => {
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
        } else if (this.objModalidad.ModalidadId > 0) {
          this.modalidadService.modificarModalidad(this.objModalidad).subscribe((respuesta: { success: boolean; }) => {
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

  recuperarModalidad(ModalidadId: number) {
    this.mensajes.msgLoad("Cargando...");
    this.modalidadService.ObtenerPorId(ModalidadId)
      .subscribe((response: { success: boolean; data: EModalidad; }) => {
        if (response.success) {
          let objModalidad = new EModalidad();
          objModalidad = response.data;
          this.ModalidadId?.setValue(objModalidad.ModalidadId);
          this.ModalidadCodigo?.setValue(objModalidad.ModalidadCodigo);
          this.ModalidadNombre?.setValue(objModalidad.ModalidadNombre);
          this.ModalidadEstado?.setValue(objModalidad.ModalidadEstado);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
          this.mensajes.msgAutoClose();
        });
  }

  get ModalidadId() { return this.frmPrincipal.get('ModalidadId') }
  get ModalidadCodigo() { return this.frmPrincipal.get('ModalidadCodigo') }
  get ModalidadNombre() { return this.frmPrincipal.get('ModalidadNombre') }
  get ModalidadEstado() { return this.frmPrincipal.get('ModalidadEstado') }
}
