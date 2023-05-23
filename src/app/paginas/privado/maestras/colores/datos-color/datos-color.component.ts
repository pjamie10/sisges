import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EColor } from '../../../../../modelos/EColor';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { ColorService } from '../../../../../servicios/color.service ';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

@Component({
  selector: 'app-datos-color',
  templateUrl: './datos-color.component.html',
  styleUrls: ['./datos-color.component.scss']
})
export class DatosColorComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objColor: EColor;
  vColorId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosColorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private colorService: ColorService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      ColorId: [0, Validators.compose([Validators.required])],
      ColorDescripcion: ["", Validators.compose([Validators.required])],
      ColorEstado: [null, Validators.required]
    });
    this.titulo = data.titulo;
    this.vColorId = data.ColorId;
    this.objColor = new EColor();
    this.lstEstado = new Array<EConjuntoDato>();}

  ngOnInit(): void {
    this.listarEstado();
    if (this.vColorId > 0) {
      debugger;
      this.recuperarColor(this.vColorId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe((response: Array<EConjuntoDato>) => {

        this.lstEstado = response;
      });
  }

  guardarDatos(form: EColor) {

    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objColor = new EColor();
        this.objColor = form;

        if (this.objColor.ColorId == 0) {
          this.colorService.insertarColor(this.objColor).subscribe((response: { success: boolean; }) => {
            if (response.success) {
              //this.mensajes.msgSuccess("", "Datos Guardados Correctamente");
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              //Swal.fire("titulo", "Datos Guardados Correctamente", "success");
              //Swal.fire(undefined, "Datos Guardados Correctamente", "success");
              this.matDialogRef.close(response);
            }
            else {
              this.mensajes.msgError("No se pudo registrare el color");
            }
          },
            (error: any) => {
              this.mensajes.msgError("No se pudo registrar el color");
            });
        } else if (this.objColor.ColorId > 0) {
          this.colorService.modificarColor(this.objColor).subscribe((respuesta: { success: boolean; }) => {
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

  recuperarColor(ColorId: number) {
    this.mensajes.msgLoad("Cargando...");
    debugger;
    this.colorService.ObtenerPorId(ColorId)
      .subscribe((response: { success: boolean; data: EColor; }) => {
        if (response.success) {
          let objColor = new EColor();
          objColor = response.data;
          this.ColorId?.setValue(objColor.ColorId);
          this.ColorDescripcion?.setValue(objColor.ColorDescripcion);
          this.ColorEstado?.setValue(objColor.ColorEstado);
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

  get ColorId() { return this.frmPrincipal.get('ColorId') }
  get ColorDescripcion() { return this.frmPrincipal.get('ColorDescripcion') }
  get ColorEstado() { return this.frmPrincipal.get('ColorEstado') }

}
