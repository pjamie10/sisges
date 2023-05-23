import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }
  msgSuccess(title: string | "", text: string, callBack?: any) {
    Swal.fire({
      title: title,
      icon: 'success',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#43a47',
      confirmButtonText: 'Aceptar',
    }).then((resultado) => {
      if (callBack) callBack();
    });
  }

  msgSuccessTemp(text: string, callBack?: any) {
    Swal.fire({
      //title: title,
      icon: 'success',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: '#43a047',
      confirmButtonText: 'Aceptar',
      timer: 2000
    }).then((resultado) => {
      if (callBack) callBack();
    });
  }

  msgWarning(text: string, callBackOk?: any, callBackError?: any) {
    Swal.fire({
      //title: title,
      icon: 'warning',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      confirmButtonColor: '#f8bb86',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
    }).then((resultado) => {
      if (resultado.value) {
        if (callBackOk) callBackOk();
      } else if (callBackError) callBackError();
    });
  }

  msgWarningMin(text: string, callBack?: any) {
    Swal.fire({
      //title: title,
      icon: 'warning',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Aceptar',
    }).then((resultado) => {
      if (callBack) callBack();
    });
  }

  msgInfo(text: string, callBack?: any) {
    Swal.fire({
      //title: title,
      icon: 'info',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Aceptar',
    }).then((resultado) => {
      if (callBack) callBack();
    });
  }

  msgConfirm(text: string, callBackOk?: any, callBackError?: any) {
    Swal.fire({
      html: text,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: '#b5b3b3',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
    }).then((resultado) => {
      debugger;
      if (resultado) {
        if (resultado.isConfirmed) callBackOk();
        if (resultado.isDismissed) callBackError();
      } else if (callBackError) callBackError();
    });
  }

  msgSend(text: string, callBackOk?: any, callBackError?: any) {
    Swal.fire({
      html: text,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: '#b5b3b3',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      reverseButtons: true,
    }).then((resultado) => {
      if (resultado.value) {
        if (callBackOk) callBackOk();
      } else if (callBackError) callBackError();
    });
  }

  msgError(text: string, callBack?: any): boolean {
    Swal.fire({
      title: 'Error',
      icon: 'error',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#f44336',
      cancelButtonText: 'Aceptar',
    }).then((value) => {
      if (callBack) callBack();
    });
    return false;
  }

  msgErrorSeguridad(text: string, callBack?: any): boolean {
    Swal.fire({
      title: 'ERROR DE SEGURIDAD',
      icon: 'error',
      html: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#f44336',
      cancelButtonText: 'Aceptar',
    }).then((value) => {
      if (callBack) callBack();
    });
    return false;
  }

  msgClose(text: string, callBackOk?: any, callBackError?: any) {
    Swal.fire({
      html: text,
      icon: 'question',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true,
      cancelButtonColor: '#babdbe',
      confirmButtonColor: "#084787",
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        if (callBackOk) callBackOk();
      } else if (callBackError) callBackError();
    });
  }

  msgAutoClose() {
    Swal.close();
  }

  msgSessionExpired(text: string, callBackOk?: any, callBackError?: any) {
    Swal.fire({
      title: '',
      html: 'Tu sesión ha expirado. Vuelve a iniciar sesión.',
      icon: 'warning',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      confirmButtonColor: "#084787",
      confirmButtonText: 'Ok',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        if (callBackOk) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          localStorage.removeItem("unidadEjecutora");
          location.reload();
          callBackOk();
        };
      } else if (callBackError) callBackError();
    });
  }

  msgSuccessMixin(titulo: string | "", texto: string | "") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: true,
      confirmButtonColor: '#43a047',
      confirmButtonText: 'Aceptar',
      width: '24rem',
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: titulo,
      text: texto
    })
  }

  msgErrorMixin(titulo: string | "", texto: string | "") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: true,
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Aceptar',
      width: '24rem',
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: titulo,
      text: texto
    })
  }

  msgErrorInferiorDerecha(titulo: string | "", texto: string | "") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: true,
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Aceptar',
      width: '24rem',
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: titulo,
      text: texto
    })
  }

  msgLoad(text: string, callBack?: any): boolean {
    Swal.fire({
      title: '',
      html: text,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(0);
      }
    }).then(() => {
      if (callBack) callBack();
    });
    return false;
  }
}
