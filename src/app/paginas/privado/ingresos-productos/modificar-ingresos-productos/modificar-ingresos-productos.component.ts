import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { EConjuntoDato } from '../../../../modelos/EConjuntoDato';
import { EDetalleIngreso, EDetalleIngresoListado, EIngreso, EIngresoListado } from '../../../../modelos/EIngreso';
import { EProductosListado } from '../../../../modelos/EProductos';
import { EUsuarioListado } from '../../../../modelos/EUsuario';
import { ConjuntoDatoService } from '../../../../servicios/conjunto-dato.service';
import { IngresoService } from '../../../../servicios/ingreso.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { UsuarioService } from '../../../../servicios/usuario.service';

@Component({
  selector: 'app-modificar-ingresos-productos',
  templateUrl: './modificar-ingresos-productos.component.html',
  styleUrls: ['./modificar-ingresos-productos.component.scss']
})
export class ModificarIngresosProductosComponent implements OnInit {
  lstTipoComprobante: Array<EConjuntoDato> | undefined;
  frmPrincipal: FormGroup;
  lstProductosAgregados: Array<EDetalleIngresoListado>;
  lstUsuario: Array<EUsuarioListado>;
  objIngreso: EIngreso;
  lstDetalleIngreso: Array<EDetalleIngreso>;
  IngresoId: number = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private servConjuntoDato: ConjuntoDatoService,
    private servUsuario: UsuarioService,
    private servIngreso: IngresoService,
    private mensajes: MensajesService,
    private route: ActivatedRoute
  ) {
    this.frmPrincipal = this.formBuilder.group({
      TipoComprobanteId: [null, Validators.required],
      PersonaRecojoId: [null, Validators.required],
      IngresoSerieComprobante: ["", Validators.required],
      IngresoNroComprobante: ["", Validators.required],
      IngresoFecha: ["", Validators.required]
    });
    //this.IngresoId = data.IngresoId;
    this.lstTipoComprobante = new Array<EConjuntoDato>();
    this.lstProductosAgregados = new Array<EDetalleIngresoListado>();
    this.lstUsuario = new Array<EUsuarioListado>();
    this.objIngreso = new EIngreso();
    this.lstDetalleIngreso = new Array<EDetalleIngreso>();
    let vId = this.route.snapshot.paramMap.get("id")?.toString();

    if (typeof vId == 'undefined') {
      this.IngresoId = 0;
    } else {
      this.IngresoId = parseInt(vId);
    }
  }

  ngOnInit(): void {
    this.listarTipoComprobante();
    this.listarUsuarios();
    if (this.IngresoId > 0)
      this.obtenerIngreso(this.IngresoId);   
  }

  retroceder() {

    this.router.navigate(['/ingresos'], { relativeTo: this.route });
  }

  agregarDetalle() {
    

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    //dialogConfig.data = {
    //  titulo: textoTitulo,
    //  ModalidadId: ModalidadId
    //};


    //const dialogRef = this.materialDialog.open(AgregarDetalleComponent, dialogConfig);

    //dialogRef.afterClosed().subscribe(
    //  (lstProductosAgregados: Array<EProductosListado>) => {
    //    if (lstProductosAgregados != null && lstProductosAgregados.length > 0) {
    //      if (this.lstProductosAgregados.length > 0) {
    //        lstProductosAgregados.forEach(objeto => {
    //          this.lstProductosAgregados.push(objeto);
    //        })
    //      } else {
    //        this.lstProductosAgregados = lstProductosAgregados;
    //      }

    //    }
    //  }
    //);
  }

  listarTipoComprobante() {
    this.servConjuntoDato.listarPorGrupo("TIPO_COMPROBANTE")
      .subscribe((response: Array<EConjuntoDato>) => {
        this.lstTipoComprobante = response;
      });
  }

  listarUsuarios() {
    this.servUsuario.listarUsuario("")
      .subscribe((response: { data: Array<EUsuarioListado>; }) => {
        this.lstUsuario = response.data;
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
          
          let objDetalleIngreso = new EDetalleIngreso();
          objDetalleIngreso.ProductoCodigo = objeto.ProductoCodigo;
          objDetalleIngreso.ProductoId = objeto.ProductoId;
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

  eliminarItem(objProducto: EDetalleIngresoListado) {
    

    let vIndiceEliminado = -1;

    this.lstProductosAgregados.forEach((objProductoEliminado) => {
      if (objProducto == objProductoEliminado) {
        vIndiceEliminado = this.lstProductosAgregados.indexOf(objProducto);
        this.lstProductosAgregados.splice(vIndiceEliminado, 1); // 1 es la cantidad de elemento a eliminar
      }
      if (vIndiceEliminado >= 0) return;
    });

  }

  obtenerIngreso(IngresoId: number) {
    this.mensajes.msgLoad("Cargando...");
    this.servIngreso.obtenerIngreso(IngresoId)
      .subscribe((response: { success: boolean; data: EIngresoListado; }) => {
        if (response.success) {
          let objIngreso = response.data;
          this.frmPrincipal.controls['TipoComprobanteId'].setValue(objIngreso.TipoComprobanteId);
          this.frmPrincipal.controls['IngresoSerieComprobante'].setValue(objIngreso.IngresoSerieComprobante);
          this.frmPrincipal.controls['IngresoNroComprobante'].setValue(objIngreso.IngresoNroComprobante);
          let fecha = moment(objIngreso.IngresoFecha).format("yyyy-MM-DD");
          this.frmPrincipal.controls['IngresoFecha'].setValue(fecha);
          this.frmPrincipal.controls['PersonaRecojoId'].setValue(objIngreso.PersonaRecojoId);
          this.lstProductosAgregados = objIngreso.lstDetalleIngresoListado;
          this.mensajes.msgAutoClose();
        }
        else {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        }
      },
        (error: any) => {
          this.mensajes.msgError("No se pudo encontrar los datos ");
        });
  }


  get TipoComprobanteId() { return this.frmPrincipal.get('TipoComprobanteId') }
  get IngresoSerieComprobante() { return this.frmPrincipal.get('IngresoSerieComprobante') }
  get IngresoNroComprobante() { return this.frmPrincipal.get('IngresoNroComprobante') }
  get PersonaRecojoId() { return this.frmPrincipal.get('PersonaRecojoId') }
  get IngresoFecha() { return this.frmPrincipal.get('IngresoFecha') }
}
