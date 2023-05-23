import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EOperadores } from '../../../../../modelos/EOperadores';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { OperadoresService } from '../../../../../servicios/operadores.service';

@Component({
  selector: 'app-datos-operadores',
  templateUrl: './datos-operadores.component.html',
  styleUrls: ['./datos-operadores.component.scss']
})
export class DatosOperadoresComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objOperadores: EOperadores;
  vOperadorId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosOperadoresComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private operadoresService: OperadoresService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      OperadorId: [0, Validators.compose([Validators.required])],
      OperadorDescripcion: ["", Validators.compose([Validators.required])],
      OperadorEstado: [null, Validators.required]
    });
    this.objOperadores = new EOperadores();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vOperadorId = data.OperadorId;
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vOperadorId > 0) {
      this.recuperarOperadores(this.vOperadorId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  guardarDatos(form: EOperadores) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objOperadores = new EOperadores();
        this.objOperadores = form;

        if (this.objOperadores.OperadorId == 0) {
          this.operadoresService.insertarOperadores(this.objOperadores).subscribe((response) => {
            if (response.success) {
              //this.mensajes.msgSuccess("", "Datos Guardados Correctamente");
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              //Swal.fire("titulo", "Datos Guardados Correctamente", "success");
              //Swal.fire(undefined, "Datos Guardados Correctamente", "success");
              this.matDialogRef.close(response);
            }
            else {
              this.mensajes.msgError("No se pudo registrar el operador");
            }
          },
            error => {
              this.mensajes.msgError("No se pudo registrar el operador");
            });
        } else if (this.objOperadores.OperadorId > 0) {
          this.operadoresService.modificarOperadores(this.objOperadores).subscribe((respuesta) => {
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

  recuperarOperadores(OperadorId: number) {
    this.mensajes.msgLoad("Cargando...");
    this.operadoresService.ObtenerPorId(OperadorId)
      .subscribe((response) => {
        if (response.success) {
          let objOperadores = new EOperadores();
          objOperadores = response.data;
          this.frmPrincipal.controls['OperadorId'].setValue(objOperadores.OperadorId);
          this.frmPrincipal.controls['OperadorDescripcion'].setValue(objOperadores.OperadorDescripcion);
          this.frmPrincipal.controls['OperadorEstado'].setValue(objOperadores.OperadorEstado);
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
        this.mensajes.msgAutoClose();
      },
        error => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        });
  }

  get OperadorDescripcion() { return this.frmPrincipal.get('OperadorDescripcion') }
  get OperadorEstado() { return this.frmPrincipal.get('OperadorEstado') }
}
