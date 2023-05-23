import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ECategoria } from '../../../../../modelos/ECategoria';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { CategoriaService } from '../../../../../servicios/categoria.service';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

@Component({
  selector: 'app-datos-categoria',
  templateUrl: './datos-categoria.component.html',
  styleUrls: ['./datos-categoria.component.scss']
})
export class DatosCategoriaComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  frmPrincipal: FormGroup;
  objCategoria: ECategoria;
  vCategoriaId: number | 0;
  constructor(
    public matDialogRef: MatDialogRef<DatosCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private mensajes: MensajesService,
    private categoriaService: CategoriaService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      CategoriaId: [0, Validators.compose([Validators.required])],
      CategoriaNombre: ["", Validators.compose([Validators.required])],
      CategoriaEstado: [null, Validators.required]
    });
    this.objCategoria = new ECategoria();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vCategoriaId = data.CategoriaId;
  }

  ngOnInit(): void {
    this.listarEstado();
    if (this.vCategoriaId > 0) {
      debugger;
      this.recuperarCategoria(this.vCategoriaId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe(response => {
        this.lstEstado = response;
      });
  }

  guardarDatos(form: ECategoria) {
    
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.objCategoria = new ECategoria();
        this.objCategoria = form;

        if (this.objCategoria.CategoriaId == 0) {
          this.categoriaService.insertarCategoria(this.objCategoria).subscribe((response) => {
            if (response.success) {
              //this.mensajes.msgSuccess("", "Datos Guardados Correctamente");
              this.mensajes.msgSuccessMixin('Datos Guardados Correctamente', "");
              //Swal.fire("titulo", "Datos Guardados Correctamente", "success");
              //Swal.fire(undefined, "Datos Guardados Correctamente", "success");
              this.matDialogRef.close(response);
            }
            else {
              this.mensajes.msgError("No se pudo registrar la categoria");
            }
          },
            error => {
              this.mensajes.msgError("No se pudo registrar la categoria");
            });
        } else if (this.objCategoria.CategoriaId > 0) {
          this.categoriaService.modificarCategoria(this.objCategoria).subscribe((respuesta) => {
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

  recuperarCategoria(Id: number) {
    this.mensajes.msgLoad("Cargando...");
    this.categoriaService.ObtenerPorId(Id)
      .subscribe((response) => {
        if (response.success) {
          let objCategoria = new ECategoria();
          objCategoria = response.data;
          this.frmPrincipal.controls['CategoriaId'].setValue(objCategoria.CategoriaId);
          this.frmPrincipal.controls['CategoriaNombre'].setValue(objCategoria.CategoriaNombre);
          this.frmPrincipal.controls['CategoriaEstado'].setValue(objCategoria.CategoriaEstado);
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

  get CategoriaNombre() { return this.frmPrincipal.get('CategoriaNombre') }
  get CategoriaEstado() { return this.frmPrincipal.get('CategoriaEstado') }
}
