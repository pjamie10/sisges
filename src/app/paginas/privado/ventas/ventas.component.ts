import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EVentaListado } from '../../../modelos/EVenta';
import { VentaService } from '../../../servicios/venta.service';
import * as FileSaver from "file-saver";
import { ReporteService } from '../../../servicios/reporte.service';
import { EPaginadoRespuesta, EPaginadoSolicitud } from '../../../modelos/EPaginado';
import { PaginacionService } from '../../../servicios/paginacion.service';
import { EArchivo } from '../../../modelos/EArchivo';
import { MensajesService } from '../../../servicios/mensajes.service';
//import { debug } from 'console';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  lstVentas: Array<EVentaListado> = [];
  fechaActual: string | null = "";
  frmBusqueda: FormGroup;

  //------------------

  companies = [];
  pageNo: any = 1;
  pageNumber: boolean[] = [];
  sortOrder: any = 'CompanyName';
  //Pagination Variables  

  pageField: number[] = [];
  exactPageList: any;
  paginationData!: number;
  companiesPerPage: any = 5;
  totalCompanies: any;
  totalCompaniesCount: any;
  //-----------------------



  constructor(
    private router: Router,
    private ventaService: VentaService,
    private dp: DatePipe,
    private mensajes: MensajesService,
    private formBuilder: FormBuilder,
    private reporteService: ReporteService,
    public paginacionService: PaginacionService
  ) {
    this.frmBusqueda = this.formBuilder.group({
      VentaFechaInicio: ["", Validators.required],
      VentaFechaFin: ["", Validators.required],
      VentaParametro: [""]
    });
  }

  ngOnInit(): void {
    this.fechaActual = this.dp.transform(new Date(), 'yyyy-MM-dd');
    this.frmBusqueda.controls['VentaFechaInicio'].setValue(this.fechaActual);
    this.frmBusqueda.controls['VentaFechaFin'].setValue(this.fechaActual);
    this.listarVentas();
  }

  nuevaVenta() {
    this.router.navigate(['/nuevaVenta']);
  }

  listarVentas() {
    this.mensajes.msgLoad("Cargando...");
    this.ventaService.listarVentas(this.VentaFechaInicio?.value, this.VentaFechaFin?.value)
      .subscribe((response: { success: boolean; data: Array<EVentaListado>; }) => {
        if (response.success) {
          this.mensajes.msgAutoClose();
          this.lstVentas = response.data;
        } else {
          this.lstVentas = [];
        }

      })
  }

  descargarReporte() {
    //setTimeout(() => {
    //  this.reporteService.obtenerReporteVenta(this.frmBusqueda.controls['VentaFechaInicio'].value, this.frmBusqueda.controls['VentaFechaFin'].value)
    //    .subscribe(
    //    (file: Blob) => {
    //      debugger;
    //      FileSaver.saveAs(file, "reporteVenta.xlsx");
    //    },
    //    () => {
    //      //this.messageService.msgAutoClose();
    //      var message ="Se produjo un error al momento de ejecución. Contacte a un administrador para un mejor soporte.";
    //      //Swal.fire("Error!", message, "error");
    //    }
    //  );
    //}, 500);



    this.reporteService.obtenerReporteVenta(this.frmBusqueda.controls['VentaFechaInicio'].value, this.frmBusqueda.controls['VentaFechaFin'].value)
      .subscribe((response: { success: boolean; data: EArchivo; } | any) => {
        debugger;
        if (response.success) {
          const blob = new Blob([this.reporteService.convertDataURIToBinary(response.data.File)], { type: response.data.ContentType ?? undefined });
          FileSaver.saveAs(blob, response.data.FileName);
          //const blob = new Blob([this.reporteService.convertDataURIToBinary("")], { type: "" ?? undefined });
          //FileSaver.saveAs(blob, "");
        }
      });



  }



  get VentaFechaInicio() { return this.frmBusqueda.get('VentaFechaInicio') }
  get VentaFechaFin() { return this.frmBusqueda.get('VentaFechaFin') }
  get VentaParametro() { return this.frmBusqueda.get('VentaParametro') }

}
