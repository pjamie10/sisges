import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidarControles } from '../../../../../componentes/validar-controles';
import { EColor } from '../../../../../modelos/EColor';
import { EConjuntoDato } from '../../../../../modelos/EConjuntoDato';
import { EMarca } from '../../../../../modelos/EMarca';
import { EProductos } from '../../../../../modelos/EProductos';
import { ETipoProducto, ETipoProductoListado } from '../../../../../modelos/ETipoProducto';
import { ColorService } from '../../../../../servicios/color.service ';
import { ConjuntoDatoService } from '../../../../../servicios/conjunto-dato.service';
import { MarcaService } from '../../../../../servicios/marca.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { ProductosService } from '../../../../../servicios/productos.service';
import { TipoProductoService } from '../../../../../servicios/tipo-producto.service';

@Component({
  selector: 'app-datos-productos',
  templateUrl: './datos-productos.component.html',
  styleUrls: ['./datos-productos.component.scss']
})
export class DatosProductosComponent implements OnInit {

  titulo: string = "";
  lstEstado: Array<EConjuntoDato> | undefined
  lstMarca: Array<EMarca> | undefined
  lstColor: Array<EColor> | undefined
  frmPrincipal: FormGroup;
  objProductos: EProductos;
  vProductoId: string | "";
  lstTipoProducto: Array<ETipoProductoListado> | Array<ETipoProductoListado>;

  mensajesValidacion = {
    'MarcaId': [
      { type: 'validarMarca', message: "La Marca es Obligatoria." }
    ]
  }
  constructor(
    private tipoProductoService: TipoProductoService,
    public matDialogRef: MatDialogRef<DatosProductosComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servMarca: MarcaService,
    private servColor: ColorService,
    private mensajes: MensajesService,
    private productosService: ProductosService
  ) {
    this.frmPrincipal = this.formBuilder.group({
      ProductoId: ["", Validators.compose([Validators.required])],
      MarcaId: [null, ValidarControles.validarMarca],
      ColorId: [null, ValidarControles.validarColor],
      TipoProductoId: [0, Validators.compose([Validators.required, ValidarControles.validarTipoProducto])],
      ProductoNombre: ["", Validators.compose([Validators.required])],
      ProductoDescripcion: ["", Validators.compose([Validators.required])],
      ProductoEstado: [null, Validators.required]
    });
    this.objProductos = new EProductos();
    this.titulo = data.titulo;
    this.lstEstado = new Array<EConjuntoDato>();
    this.vProductoId = data.ProductoId;
    this.lstTipoProducto = new Array<ETipoProductoListado>();
    this.lstTipoProducto = [];
  }

  ngOnInit(): void {
    this.listarTipoProducto("");
    this.listarEstado();
    this.listarMarca();
    this.listarColor();
    if (this.vProductoId.trim().length > 0) {
      this.ProductoId?.disable();
      this.recuperarProducto(this.vProductoId);
    }
  }

  listarEstado() {
    this.servConjuntoDato.listarPorGrupo("ESTADO")
      .subscribe((response: EConjuntoDato[] | undefined) => {
        this.lstEstado = response;
      });
  }

  listarMarca() {
    this.servMarca.listarMarca("")
      .subscribe((response: { success: any; data: any[]; }) => {
        if (response.success) {
          this.lstMarca = response.data;
        }
        else {
          this.lstMarca = [];
        }
      });
  }

  listarColor() {
    this.servColor.listarColor("")
      .subscribe((response: { success: any; data: any[]; }) => {
        if (response.success) {
          this.lstColor = response.data;
        }
        else {
          this.lstColor = [];
        }
      });
  }

  listarTipoProducto(vParametro: string) {
    this.tipoProductoService.listarTipoProducto(vParametro)
      .subscribe((response: { success: any; data: any[]; }) => {
        if (response.success) {
          this.lstTipoProducto = response.data.filter((x: { TipoProductoEstado: string; }) => x.TipoProductoEstado == "A");
        }
        else {
          this.lstTipoProducto = [];
        }
      });
  }

  guardarDatos(form: EProductos) {
    if (this.frmPrincipal.valid) {
      debugger;
      //SI EL CODIGO ES DE EQUIPOS CELULARES, ENTONCES MARCA Y COLOR DEBEN SER OBILIGATORIOS
      let vMarcaValida = true;
      let vColorValido = true;
      if (this.TipoProductoId?.value == 1) {
        if (this.MarcaId?.value == null || this.MarcaId?.value == undefined) {
          vMarcaValida = false;
        }
        if (this.ColorId?.value == null || this.ColorId?.value == undefined) {
          vColorValido = false;  
        }
      }
      if (vMarcaValida && vColorValido) {
        this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
          this.objProductos = new EProductos();
          this.objProductos = form;
          debugger;

          if (this.data.ProductoId.trim().length == 0) {
            this.productosService.insertarProducto(this.objProductos).subscribe((respuesta: { success: boolean; messages: { Message: string; }[]; }) => {
              debugger;
              if (respuesta.success) {
                this.mensajes.msgSuccessMixin(respuesta.messages[0].Message, "");
                this.matDialogRef.close(respuesta);
              }
              else {
                this.mensajes.msgError("No se pudo registrar el equipo: " + respuesta.messages[0].Message);
              }
            },
              (error: any) => {
                this.mensajes.msgError("No se pudo registrar el equipo");
              });
          }
          else {
            debugger;
            this.objProductos.ProductoId = this.data.ProductoId;
            this.productosService.modificarProducto(this.objProductos).subscribe((respuesta: { success: boolean; messages: { Message: string; }[]; }) => {
              if (respuesta.success) {
                this.mensajes.msgSuccessMixin(respuesta.messages[0].Message, "");
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
      } else {
        if (!vMarcaValida && vColorValido) {
          this.mensajes.msgError("La Marca es Obligatoria");
        } else if (vMarcaValida && !vColorValido) {
          this.mensajes.msgError("El Color es Obligatorio");
        } else if (!vMarcaValida && !vColorValido) {
          this.mensajes.msgError("La Marca y el Color es Obligatorio");
        }
        
      }
      
    }
    else {
      this.mensajes.msgError("Ingrese Todos Los Campos Obligatorios");
      this.frmPrincipal.markAllAsTouched();
    }
  }

  recuperarProducto(ProductoId: string) {
    this.mensajes.msgLoad("Cargando...");
    this.productosService.ObtenerPorId(ProductoId)
      .subscribe((response: { success: boolean; data: EProductos; }) => {
        if (response.success) {
          let objProductos = new EProductos();
          objProductos = response.data;
          debugger;
          this.frmPrincipal.controls['ProductoId'].setValue(objProductos.ProductoId);
          this.frmPrincipal.controls['TipoProductoId'].setValue(objProductos.TipoProductoId);
          this.frmPrincipal.controls['ProductoNombre'].setValue(objProductos.ProductoNombre);
          this.frmPrincipal.controls['ProductoDescripcion'].setValue(objProductos.ProductoDescripcion);
          this.frmPrincipal.controls['ProductoEstado'].setValue(objProductos.ProductoEstado);
          this.frmPrincipal.controls['MarcaId'].setValue(objProductos.MarcaId);
          this.frmPrincipal.controls['ColorId'].setValue(objProductos.ColorId);
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

  buscarPorCodigo(event: any) {
    let vCodigo = event.target.value;
    debugger;
    if (vCodigo.trim().length > 0) {
      this.mensajes.msgLoad("Cargando...");
      this.productosService.ObtenerPorId(vCodigo)
        .subscribe((response: { success: boolean; data: EProductos; }) => {
          if (response.success) {
            this.mensajes.msgConfirm('El Código Ya fue registrado ¿Desea Modificar?', () => {
              let objProductos = new EProductos();
              objProductos = response.data;
              debugger;
              this.vProductoId = vCodigo;
              this.data.ProductoId = vCodigo;
              this.ProductoId?.disable();
              this.frmPrincipal.controls['ProductoId'].setValue(objProductos.ProductoId);
              this.frmPrincipal.controls['TipoProductoId'].setValue(objProductos.TipoProductoId);
              this.frmPrincipal.controls['ProductoNombre'].setValue(objProductos.ProductoNombre);
              this.frmPrincipal.controls['ProductoDescripcion'].setValue(objProductos.ProductoDescripcion);
              this.frmPrincipal.controls['ProductoEstado'].setValue(objProductos.ProductoEstado);
              this.frmPrincipal.controls['MarcaId'].setValue(objProductos.MarcaId);
              this.frmPrincipal.controls['ColorId'].setValue(objProductos.ColorId);
            }, () => {
                this.frmPrincipal.controls['ProductoId'].setValue("");
            });
          } else {
          this.mensajes.msgAutoClose();
          }
        },
          (error: any) => {
            this.mensajes.msgError("No se pudo encontrar los datos ");
            this.mensajes.msgAutoClose();
          });
    }
  }

  get ProductoId() { return this.frmPrincipal.get('ProductoId') }
  get ProductoNombre() { return this.frmPrincipal.get('ProductoNombre') }
  get ProductoDescripcion() { return this.frmPrincipal.get('ProductoDescripcion') }
  get TipoProductoId() { return this.frmPrincipal.get('TipoProductoId') }
  get ProductoEstado() { return this.frmPrincipal.get('ProductoEstado') }
  get MarcaId() { return this.frmPrincipal.get('MarcaId') }
  get ColorId() { return this.frmPrincipal.get('ColorId') }
}
