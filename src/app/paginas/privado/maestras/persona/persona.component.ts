import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription, BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, filter, finalize, map } from 'rxjs/operators';
import { EPersonaEmpresa, EPersonaEmpresaListado } from '../../../../modelos/EPersonaEmpresa';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { PersonaEmpresaService } from '../../../../servicios/persona-empresa.service';
import { DatosPersonaComponent } from './datos-persona/datos-persona.component';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {

  lstPersona: Array<EPersonaEmpresaListado> | Array<EPersonaEmpresaListado>;
  txtBuscar: string | "";
  constructor(
    private personaEmpresaService: PersonaEmpresaService,
    private materialDialog: MatDialog,
    private mensajes: MensajesService
  ) {
    this.lstPersona = new Array<EPersonaEmpresaListado>();
    this.lstPersona = [];
    this.txtBuscar = "";
  }

  ngOnInit(): void {
    this.listarDatos(this.txtBuscar);
  }

  buscarPersona(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.listarDatos(texto);
  }

  listarDatos(vParametro: string) {
    if (this.txtBuscar.length == 0) {
      this.mensajes.msgLoad("Cargando...");
    }
    this.personaEmpresaService.listarPersona(vParametro)
      .subscribe((response: { success: boolean; data: EPersonaEmpresaListado[]; }) => {
        if (response.success) {
          this.lstPersona = response.data;
        }
        else {
          this.lstPersona = [];
        }
        this.mensajes.msgAutoClose();
      },
        (error: any) => {
          this.mensajes.msgError("No se pudieron cargar los registros");
        });
  }

  abrirDatosPersona(PersonaId: number) {
    debugger
    let textoTitulo: string = "";
    if (PersonaId == 0) textoTitulo = "Registrar Persona";
    else textoTitulo = "Modificar Persona";

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      titulo: textoTitulo,
      PersonaId: PersonaId
    };
    const dialogRef = this.materialDialog.open(DatosPersonaComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data.success) this.listarDatos(this.txtBuscar);
      }
    );
  }

  eliminarPersona(objPersona: EPersonaEmpresa) {
    this.mensajes.msgConfirm('¿Esta Seguro Que Desea Eliminar a ' + objPersona.PersonaEmpresaNombre + ' ' + objPersona.PersonaEmpresaApellidoPaterno + ' ' + objPersona.PersonaEmpresaApellidoMaterno + ' del Registro?', () => {
      objPersona.PersonaEmpresaEstado = "X";
      this.personaEmpresaService.modificarEstadoPersona(objPersona).subscribe((respuesta: { success: boolean; }) => {
        if (respuesta.success) {
          this.mensajes.msgSuccessMixin('Datos Eliminados Correctamente.', "");
          this.listarDatos(this.txtBuscar);
        } else {
          this.mensajes.msgError("No se pudo eliminar el registro.");
        }
      }, () => {
        this.mensajes.msgError("No se pudo eliminar el registro.");
      })
    });
  }
}
