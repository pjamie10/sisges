import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { EUsuario } from '../../modelos/EUsuario';
import { MensajesService } from '../../servicios/mensajes.service';
import { UsuarioService } from '../../servicios/usuario.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;
  frmLogin: FormGroup;
  matcher = new MyErrorStateMatcher();
  constructor(
    private element: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private mensajes: MensajesService,
    private usuarioService: UsuarioService
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
    this.frmLogin = this.formBuilder.group({
      usuario: [null, [Validators.required, Validators.minLength(5)]],
      contrasenia: [null, [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove('card-hidden');
    }, 700);
  }
  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName('body')[0];
    var sidebar = document.getElementsByClassName('navbar-collapse')[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add('toggled');
      }, 500);
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
  }

  acceder() {

    if (this.frmLogin.valid) {
      let objFormulario = this.frmLogin.value;
      let vUsuario = objFormulario.usuario;
      let vContrasenia = objFormulario.contrasenia;

      this.usuarioService.validarUsuario(vUsuario, vContrasenia)
        .subscribe((response: { success: boolean; data: string; }) => {
          if (response.success) {
            debugger;
            this.usuarioService.setToken(response.data);
            //response.data
            //          logout() {
            //            localStorage.removeItem('token');
            //          }

            //public get logIn(): boolean {
            //        return(localStorage.getItem('token') !== null);
            //  }
            this.router.navigate(['/dashboard']);
          }
          else {
            this.mensajes.msgErrorMixin("", "Usuario o Contraseña Incorrecta");
          }
        },
          (error: any) => {
            this.mensajes.msgError("Error al validar usuario:" + error);
          });
    } else {
      this.validateAllFormFields(this.frmLogin);
      this.mensajes.msgErrorMixin("", "Ingrese Todos Los Campos Obligatorios");
    }

  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field)?.valid && form.get(field)?.touched;

  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  get usuario() { return this.frmLogin.get('usuario') }
  get contrasenia() { return this.frmLogin.get('contrasenia') }

  usuarioFormControl = new FormControl(null, [Validators.required, Validators.minLength(5)]);
  contraseniaFormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
}
