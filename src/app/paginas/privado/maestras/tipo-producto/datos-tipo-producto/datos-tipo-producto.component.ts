import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { ETipoProducto } from '../../../../../modelos/ETipoProducto';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { TipoProductoService } from '../../../../../servicios/tipo-producto.service';

@Component({
  selector: 'app-datos-tipo-producto',
  templateUrl: './datos-tipo-producto.component.html',
  styleUrls: ['./datos-tipo-producto.component.scss']
})
export class DatosTipoProductoComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objTipoProducto: ETipoProducto;
  vTipoProductoId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosTipoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private tipoProductoService: TipoProductoService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      TipoProductoId: [0, Validators.compose([Validators.required])],
      TipoProductoDescripcion: ["", Validators.compose([Validators.required])],
      TipoProductoEstado: [null, Validators.required]
    });
    this.objTipoProducto = new ETipoProducto();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vTipoProductoId = data.TipoProductoId;
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vTipoProductoId > 0) {
      this.recuperarTipoProducto(this.vTipoProductoId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  guardarDatos(form: ETipoProducto) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objTipoProducto = new ETipoProducto();
        this.objTipoProducto = form;

        if (this.objTipoProducto.TipoProductoId == 0) {
          this.tipoProductoService.insertarTipoProducto(this.objTipoProducto).subscribe((response) => {
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
        } else if (this.objTipoProducto.TipoProductoId > 0) {
          this.tipoProductoService.modificarTipoProducto(this.objTipoProducto).subscribe((respuesta) => {
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

  recuperarTipoProducto(TipoProductoId: number) {
    this.mensajes.msgLoad("Cargando...");
    this.tipoProductoService.ObtenerPorId(TipoProductoId)
      .subscribe((response: { success: boolean; data: ETipoProducto; }) => {
        if (response.success) {
          let objTipoProducto = new ETipoProducto();
          objTipoProducto = response.data;
          this.frmPrincipal.controls['TipoProductoId'].setValue(objTipoProducto.TipoProductoId);
          this.frmPrincipal.controls['TipoProductoDescripcion'].setValue(objTipoProducto.TipoProductoDescripcion);
          this.frmPrincipal.controls['TipoProductoEstado'].setValue(objTipoProducto.TipoProductoEstado);
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

  get TipoProductoDescripcion() { return this.frmPrincipal.get('TipoProductoDescripcion') }
  get TipoProductoEstado() { return this.frmPrincipal.get('TipoProductoEstado') }

}
