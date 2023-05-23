import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidarControles } from '../../../../componentes/validar-controles';
import { EConjuntoDato } from '../../../../modelos/EConjuntoDato';
import { EDetalleIngreso, EDetalleIngresoListado, EIngreso } from '../../../../modelos/EIngreso';
import { EProductosListado } from '../../../../modelos/EProductos';
import { ETipoProductoListado } from '../../../../modelos/ETipoProducto';
import { EUsuarioListado } from '../../../../modelos/EUsuario';
import { ConjuntoDatoService } from '../../../../servicios/conjunto-dato.service';
import { IngresoService } from '../../../../servicios/ingreso.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { AgregarDetalleComponent } from './agregar-detalle/agregar-detalle.component';

@Component({
  selector: 'app-nuevos-ingresos-productos',
  templateUrl: './nuevos-ingresos-productos.component.html',
  styleUrls: ['./nuevos-ingresos-productos.component.scss']
})

export class NuevosIngresosProductosComponent implements OnInit {

  titulo: string = "";
  lstTipoComprobante: Array<EConjuntoDato> | undefined;
  frmPrincipal: FormGroup;
  lstProductosAgregados: Array<EProductosListado>;
  lstUsuario: Array<EUsuarioListado>;
  lstUsuarioFiltro: Array<EUsuarioListado>;
  objIngreso: EIngreso;
  lstDetalleIngreso: Array<EDetalleIngreso>;
  mensajesValidacion = {
    'IngresoNroComprobante': [
      { type: 'required', message: 'El Número de Comprobante es obligatorio.' },
      { type: 'maxlength', message: 'El Número de Comprobante debe contener máximo 20 digitos.' },
      { type: 'pattern', message: 'El Número de Comprobante sólo debe contener digitos.' },
      { type: 'validarIngresoNroComprobante', message: 'El Número de Comprobante debe contener 20 digitos.' }
    ],
    'IngresoSerieComprobante': [
      { type: 'required', message: 'El Número de Serie es obligatorio.' },
      { type: 'maxlength', message: 'El Número de Serie debe contener máximo 10 digitos.' },
      { type: 'pattern', message: 'El Número de Serie sólo debe contener digitos.' },
      { type: 'validarIngresoSerieComprobante', message: 'El Número de Serie debe contener 10 digitos.' }
    ]
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servUsuario: UsuarioService,
    private servIngreso: IngresoService,
    private mensajes: MensajesService,
    private materialDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.frmPrincipal = this.formBuilder.group({
      TipoComprobanteId: [null, Validators.required],
      PersonaRecojoId: [null, Validators.required],
      IngresoSerieComprobante: ["", Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]*'), ValidarControles.validarIngresoSerieComprobante])],
      IngresoNroComprobante: ["", Validators.compose([Validators.required, Validators.maxLength(20), Validators.pattern('[0-9]*'), ValidarControles.validarIngresoNroComprobante])],
      IngresoFecha: ["", Validators.required]
    });
    this.lstTipoComprobante = new Array<EConjuntoDato>();
    this.lstProductosAgregados = new Array<EProductosListado>();
    this.lstUsuario = new Array<EUsuarioListado>();
    this.lstUsuarioFiltro = new Array<EUsuarioListado>();
    this.objIngreso = new EIngreso();
    this.lstDetalleIngreso = new Array<EDetalleIngreso>();
  }

  ngOnInit(): void {
    this.listarTipoComprobante();
    this.listarUsuarios();
  }

  retroceder() {

    this.router.navigate(['/ingresos'], { relativeTo: this.route });
  }

  agregarDetalle() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";

    const dialogRef = this.materialDialog.open(AgregarDetalleComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (lstProductosAgregados: Array<EProductosListado>) => {
        if (lstProductosAgregados != null && lstProductosAgregados.length > 0) {
          debugger;
          if (this.lstProductosAgregados.length > 0) {
           
            lstProductosAgregados.forEach(objeto => {
              this.lstProductosAgregados.push(objeto);
            })
          } else {
            this.lstProductosAgregados = lstProductosAgregados;
          }

        }
      }
    );
  }

  editarDetalle() {

  }

  listarTipoComprobante() {
    this.servConjuntoDato.listarPorGrupo("TIPO_COMPROBANTE")
      .subscribe((response: Array<EConjuntoDato>) => {
        this.lstTipoComprobante = response;
        this.TipoComprobanteId?.setValue("09");
      });
  }

  listarUsuarios() {
    this.servUsuario.listarUsuario("")
      .subscribe((response: { data: Array<EUsuarioListado>; }) => {
        this.lstUsuario = response.data;
        this.lstUsuarioFiltro = this.lstUsuario.slice();
      });
  }

  guardarIngreso(form: EIngreso) {
    if (this.frmPrincipal.valid) {
      this.mensajes.msgConfirm('¿Esta Seguro Que Desea Guardar Los Datos?', () => {
        this.mensajes.msgLoad("Procesando...");
        this.objIngreso = new EIngreso();
        this.objIngreso = form;
        let lstDetalleIngreso = new Array<EDetalleIngreso>();
        this.lstProductosAgregados.forEach(objeto => {
          debugger;
          let objDetalleIngreso = new EDetalleIngresoListado();
          objDetalleIngreso.ProductoCodigo = objeto.ProductoCodigo;
          objDetalleIngreso.ProductoId = objeto.ProductoId;
          objDetalleIngreso.TipoProductoDescripcion;
          objDetalleIngreso.TipoChip = objeto.TipoChip;
          if (objeto.TipoChip == "R") {
            objDetalleIngreso.Desde = objeto.Desde;
            objDetalleIngreso.Hasta= objeto.Hasta;
          }
          lstDetalleIngreso.push(objDetalleIngreso);
        })
        this.objIngreso.lstDetalleIngreso = lstDetalleIngreso;

        this.servIngreso.insertarIngreso(this.objIngreso).subscribe((response: { success: boolean; }) => {
          if (response.success) {
            this.mensajes.msgSuccess("INGRESOS", "Productos Ingresados Correctamente");
            this.router.navigate(['/ingresos']);
          }
          else {
            this.mensajes.msgError("No se pudo registrar el ingreso");
          }
        },
          (error: any) => {
            this.mensajes.msgError("No se pudo registrar el ingreso");
          });
      });
    }
    else {
      this.mensajes.msgError("Ingrese Todos Los Campos Obligatorios");
      this.frmPrincipal.markAsUntouched();
    }
  }

  eliminarItem(objProducto: EProductosListado) {
    
    let vIndiceEliminado = -1;

    this.lstProductosAgregados.forEach( (objProductoEliminado) => {
      if (objProducto == objProductoEliminado) {
        vIndiceEliminado = this.lstProductosAgregados.indexOf(objProducto);
        this.lstProductosAgregados.splice(vIndiceEliminado, 1); // 1 es la cantidad de elemento a eliminar
      }
      if (vIndiceEliminado >= 0) return;
    });

  }

  get TipoComprobanteId() { return this.frmPrincipal.get('TipoComprobanteId') }
  get IngresoSerieComprobante() { return this.frmPrincipal.get('IngresoSerieComprobante') }
  get IngresoNroComprobante() { return this.frmPrincipal.get('IngresoNroComprobante') }
  get PersonaRecojoId() { return this.frmPrincipal.get('PersonaRecojoId') }
  get IngresoFecha() { return this.frmPrincipal.get('IngresoFecha') }
}
