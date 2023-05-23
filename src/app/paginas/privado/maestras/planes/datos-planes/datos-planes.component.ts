import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EPlanes } from '../../../../../modelos/EPlanes';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { PlanesService } from '../../../../../servicios/planes.service';

@Component({
  selector: 'app-datos-planes',
  templateUrl: './datos-planes.component.html',
  styleUrls: ['./datos-planes.component.scss']
})
export class DatosPlanesComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objPlanes: EPlanes;
  vPlanId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosPlanesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private planesService: PlanesService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      PlanId: [0, Validators.compose([Validators.required])],
      PlanDescripcion: ["", Validators.compose([Validators.required])],
      PlanValor: ["", Validators.compose([Validators.required])],
      PlanEstado: [null, Validators.required]
    });
    this.objPlanes = new EPlanes();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vPlanId = data.PlanId;
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vPlanId > 0) {
      this.recuperarPlanes(this.vPlanId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  guardarDatos(form: EPlanes) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objPlanes = new EPlanes();
        this.objPlanes = form;

        if (this.objPlanes.PlanId == 0) {
          this.planesService.insertarPlanes(this.objPlanes).subscribe((response) => {
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
        } else if (this.objPlanes.PlanId > 0) {
          this.planesService.modificarPlanes(this.objPlanes).subscribe((respuesta) => {
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

  recuperarPlanes(PlanId: number) {
    this.mensajes.msgLoad("Cargando...");
    this.planesService.ObtenerPorId(PlanId)
      .subscribe((response) => {
        if (response.success) {
          let objPlanes = new EPlanes();
          objPlanes = response.data;
          this.frmPrincipal.controls['PlanId'].setValue(objPlanes.PlanId);
          this.frmPrincipal.controls['PlanDescripcion'].setValue(objPlanes.PlanDescripcion);
          this.frmPrincipal.controls['PlanValor'].setValue(objPlanes.PlanValor);
          this.frmPrincipal.controls['PlanEstado'].setValue(objPlanes.PlanEstado);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
        this.mensajes.msgAutoClose();
      },
        error => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
          this.mensajes.msgAutoClose();
        });
  }

  get PlanDescripcion() { return this.frmPrincipal.get('PlanDescripcion') }
  get PlanValor() { return this.frmPrincipal.get('PlanValor') }
  get PlanEstado() { return this.frmPrincipal.get('PlanEstado') }

}

