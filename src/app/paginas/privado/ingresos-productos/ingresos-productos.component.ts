import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EDetalleIngreso, EIngreso, EIngresoListado } from '../../../modelos/EIngreso';
import { IngresoService } from '../../../servicios/ingreso.service';
import { MensajesService } from '../../../servicios/mensajes.service';

@Component({
  selector: 'app-ingresos-productos',
  templateUrl: './ingresos-productos.component.html',
  styleUrls: ['./ingresos-productos.component.scss']
})
export class IngresosProductosComponent implements OnInit {

  lstIngresos: Array<EIngresoListado> | Array<EIngresoListado>;
  lstIngreso: Array<EIngreso> | Array<EIngreso>;
  txtBuscar: string | "";
  lstIngresosAgregados: Array<EIngresoListado>;
  frmBusqueda: FormGroup;
  fechaActual: string | null = "";
  constructor(
    private ingresosService: IngresoService,
    private mensajes: MensajesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dp: DatePipe
  ) {
    this.frmBusqueda = this.formBuilder.group({
      IngresoFechaInicio: ["", Validators.required],
      IngresoFechaFin: ["", Validators.required],
      IngresoParametro: [""]
    });
    this.lstIngresos = new Array<EIngresoListado>();
    this.lstIngresos = [];
    this.lstIngreso = new Array<EIngreso>();
    this.lstIngreso = [];
    this.txtBuscar = "";
    this.lstIngresosAgregados = new Array<EIngresoListado>();
  }

  ngOnInit(): void {
    this.fechaActual = this.dp.transform(new Date(), 'yyyy-MM-dd');
    this.frmBusqueda.controls['IngresoFechaInicio'].setValue(this.fechaActual);
    this.frmBusqueda.controls['IngresoFechaFin'].setValue(this.fechaActual);
    this.listarDatos();
  }

  //buscarIngresos(event: Event) {
  //  const texto = (event.target as HTMLInputElement).value;
  //  this.listarDatos();
  //}

  listarDatos() {
    this.mensajes.msgLoad("Cargando...");
    this.ingresosService.listarIngreso(this.IngresoFechaInicio?.value, this.IngresoFechaFin?.value)
      .subscribe((response: { success: boolean; data: EIngresoListado[]; }) => {
        this.mensajes.msgAutoClose();
        debugger
        if (response.success) this.lstIngresos = response.data.filter((ingreso) => ingreso.IngresoEliminado == false);
        else this.lstIngresos = [];
      });
  }

  nuevoIngreso() {

    this.router.navigate(['nuevoIngreso'], { relativeTo: this.route });
  }

  editarIngreso(IngresoId: number) {

    this.router.navigate(['editarIngreso', IngresoId], { relativeTo: this.route });
  }

  verIngreso(IngresoId: number) {

    this.router.navigate(['verIngreso', IngresoId], { relativeTo: this.route });
  }

  eliminarIngreso(IngresoId: number) {
    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar el Registro?', () => {
      this.ingresosService.EliminarIngreso(IngresoId).subscribe((respuesta: { success: boolean; }) => {
        debugger;
        if (respuesta.success) {
          this.listarDatos();
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        }
      }, () => {
        this.mensajes.msgError("No se pudo eliminar el registro.");
      })
    });
  }

  get IngresoFechaInicio() { return this.frmBusqueda.get('IngresoFechaInicio') }
  get IngresoFechaFin() { return this.frmBusqueda.get('IngresoFechaFin') }
  get IngresoParametro() { return this.frmBusqueda.get('IngresoParametro') }
}


