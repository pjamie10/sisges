import { _isNumberValue } from '@angular/cdk/coercion';
import { FormControl, FormGroup } from '@angular/forms';

export class ValidarControles {

  static validarExisteICID(fc: FormControl) {

    if (fc.value != null) {
      if (fc.value <= 0) {
        return ({ validarExisteICID: true });
      } else {
        return (null);
      }
    } else {
      return (null);
    }
  }

  static validarCorreo(fc: FormControl){
    if (fc.value == "") {
      return ({ validarCorreo: true });
    } else {
      return (null);
    }
  }


  static validarExisteIMEI(fc: FormControl) {

    if (fc.value != null) {
      if (fc.value <= 0) {
        return ({ validarExisteIMEI: true });
      } else {
        return (null);
      }
    } else {
      return (null);
    }
  }

  static validarICID(fc: FormControl) {
    if (fc.value != null) {
      if (fc.value.length != 10) {
        return ({ validarICID: true });
      } else {
        return (null);
      }
    } else {
      return (null);
    }

  }

  static validarSEC(fc: FormControl) {
    debugger;
    let CategoriaId = fc.parent?.get("CategoriaId")?.value;
    let ModalidadId = fc.parent?.get("ModalidadId")?.value;
    let TipoCategoriaId = fc.parent?.get("TipoCategoriaId")?.value;

    if (CategoriaId == 1 && ModalidadId == 6 && TipoCategoriaId == 'C') {
      return (null);
    } else {
      if (fc.value.length != 8) {
        return ({ validarSEC: true });
      } else {
        return (null);
      }
    }

  }

  static validarNroCelular(fc: FormControl) {
    if (fc.value != null) {
      if (fc.value.length != 9) {
        return ({ validarNroCelular: true });
      } else {
        return (null);
      }
    } else {
      return (null);
    }

  }

  static validarDireccion(fc: FormControl) {

    if (fc.value == "") {
      return ({ validarDireccion: true });
    } else {
      return (null);
    }
  }

  static validarIMEI(fc: FormControl) {
    if (fc.value != null) {
      if (fc.value.length != 15) {
        return ({ validarIMEI: true });
      } else {
        return (null);
      }
    } else {
      return (null);
    }

  }

  static validarOperador(fc: FormControl) {

    if (fc.value == null || fc.value == 0) {
      return ({ validarOperador: true });
    } else {
      return (null);
    }
  }

  static validarEstado(fc: FormControl) {

    if (fc.value == null || fc.value == 0) {
      return ({ validarEstado: true });
    } else {
      return (null);
    }
  }

  static validarModalidad(fc: FormControl) {

    if (fc.value == null || fc.value == 0) {
      return ({ validarModalidad: true });
    } else {
      return (null);
    }
  }

  static validarPlanes(fc: FormControl) {

    if (fc.value == null || fc.value == 0) {
      return ({ validarPlanes: true });
    } else {
      return (null);
    }
  }

  static validarGrupo(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarGrupo: true });
    } else {
      return (null);
    }
  }

  static validarPerfil(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarPerfil: true });
    } else {
      return (null);
    }
  }

  static validarTipoDocumento(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarTipoDocumento: true });
    } else {
      return (null);
    }
  }

  static validarTipoComprobante(fc: FormControl) {
    if (fc.value == null || fc.value == "") {
      return ({ validarTipoComprobante: true });
    } else {
      return (null);
    }
  }

  static validarComprobante(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarComprobante: true });
    } else {
      return (null);
    }
  }

  static validarIngresoNroComprobante(fc: FormControl) {
    if (fc.value.length == 0) {
      return ({ validarIngresoNroComprobante: true });
    } else {
      return (null);
    }
  }

  static validarIngresoSerieComprobante(fc: FormControl) {
    if (fc.value.length == 0) {
      return ({ validarIngresoSerieComprobante: true });
    } else {
      return (null);
    }
  }

  static validarNumeroDocumento(fc: FormControl) {
    let tipoDocumentoId = fc.parent?.get("TipoDocumentoId")?.value;
    let numeroDocumento = fc.parent?.get("PersonaEmpresaNumeroDocumento")?.value;

    if (tipoDocumentoId == "6" && numeroDocumento.length != 11) {//RUC
      return ({ validarNumeroDocumento: true });
    } else if (tipoDocumentoId == "1" && numeroDocumento.length != 8) {//DNI
      return ({ validarNumeroDocumento: true });
    }
    else {
      return (null);
    }
  }

  static validarRazonSocial(fc: FormControl) {
    let tipoDocumentoId = fc.parent?.get("TipoDocumentoId")?.value;

    if (tipoDocumentoId == "6" && fc.value.trim().length == 0) {//RUC
      return ({ validarRazonSocial: true });
    }
    else {
      return (null);
    }
  }

  static validarNombres(fc: FormControl) {

    if (fc.value == "" || fc.value == null) {
      return ({ validarNombres: true });
    } else {
      return (null);
    }
  }

  static validarApellidoPaterno(fc: FormControl) {

    if (fc.value == "" || fc.value == null) {
      return ({ validarApellidoPaterno: true });
    } else {
      return (null);
    }
  }

  static validarApellidoMaterno(fc: FormControl) {

    if (fc.value == "" || fc.value == null) {
      return ({ validarApellidoMaterno: true });
    } else {
      return (null);
    }
  }

  static validarFechaNacimiento(fc: FormControl) {
    if (fc.value == "" || fc.value == null) {
      return ({ validarFechaNacimiento: true });
    } else {
      return (null)
    }

  }


  static validarMonto(fc: FormControl) {
    debugger;
    /*|| !_isNumberValue(fc.value)*/
    if (fc.value == 0 || fc.value <= 0 || fc.value.trim() == "") {
      return ({ validarMonto: true });
    } else {
      return (null);
    }
  }

  static validarCuotas(fc: FormControl) {
    debugger;
    let tipoVentaId = fc.parent?.get("TipoVentaId")?.value;
    let valorCuota = fc.parent?.get("Cuotas")?.value;

    if (tipoVentaId == "02" && (valorCuota == 0 || valorCuota == null || valorCuota == "")) {//CUOTAS
      return ({ validarCuotas: true });
    } else {
      return (null)
    }
  }

  static validarMontoCuota(fc: FormControl) {
    debugger;
    let tipoVentaId = fc.parent?.get("TipoVentaId")?.value;
    let MontoCuota = fc.parent?.get("MontoCuota")?.value;

    if (tipoVentaId == "02" && (MontoCuota == 0 || MontoCuota == null || MontoCuota == "")) {//CUOTAS
      return ({ validarMontoCuota: true });
    } else {
      return (null)
    }
  }

  static validarMarca(fc: FormControl) {

    let TipoProductoId = fc.parent?.get("TipoProductoId")?.value;
    if (TipoProductoId == 1 && (fc?.value == null || fc?.value == undefined)) {//EQUIPO CELULAR
      return ({ validarMarca: true });
    } else {
      return (null)
    }
  }

  static validarTipoProducto(fc: FormControl) {

    if (fc.value == null || fc.value == 0) {//EQUIPO CELULAR
      return ({ validarTipoProducto: true });
    } else {
      return (null)
    }
  }

  static validarColor(fc: FormControl) {

    let TipoProductoId = fc.parent?.get("TipoProductoId")?.value;

    if (TipoProductoId == 1 && (fc?.value == null || fc?.value == undefined)) {//EQUIPO CELULAR
      return ({ validarColor: true });
    } else {
      return (null)
    }
  }

  static validarNombreApellidos(fc: FormControl) {
    if (fc.value == "") {
      return ({ validarNombreApellidos: true });
    } else {
      return (null);
    }
  }

  static validarNumeroDias(fc: FormControl) {

    if (fc.value <= 0 || fc.value == "" || fc.value == null) {
      return ({ validarNumeroDias: true });
    } else {
      return (null);
    }
  }

  static validarContraseña(fc: FormControl) {
    let contraseña = fc.parent?.get("Password")?.value;

    if (contraseña == null || contraseña.length < 6) {
      return ({ validarContraseña: true });
    }
    else {
      return (null);
    }
  }

  static validarRepetirContraseña(fc: FormControl) {
    let contraseña = fc.parent?.get("Password")?.value;
    let repetirContraseña = fc.parent?.get("RtryPassword")?.value;

    if (repetirContraseña != contraseña && contraseña != repetirContraseña || repetirContraseña == null) {
      return ({ validarRepetirContraseña: true });
    }
    else {
      return (null);
    }
  }


  static validarTipoVentas(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarTipoVentas: true });
    } else {
      return (null);
    }
  }

  static validarCampos(fc: FormControl) {
    if (fc.value == null || fc.value == 0) {
      return ({ validarCampos: true });
    } else {
      return (null);
    }
  }
}

