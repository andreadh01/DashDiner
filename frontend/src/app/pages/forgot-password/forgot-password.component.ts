import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service'; // Ajusta la ruta adecuada
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  mensaje: any;
  constructor(
    private globalService: GlobalService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      const correo = (document.getElementById('email') as HTMLInputElement)
        .value;
      this.globalService.forgotPassword(correo).subscribe((response) => {
        console.log(response.codigoboolean);
        if (response.codigoboolean) {
          sessionStorage.setItem('reset_code', JSON.stringify(response));
          this.forgotPasswordForm.reset();
          this.router.navigateByUrl('/reset-code');
        } else {
          this.mensaje = {
            tipo: 'error',
            contenido: 'No existe un usuario con ese correo',
          };
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
      this.mensaje = { tipo: 'error', contenido: 'Ingrese un correo válido' };
    }
  }
  get email() {
    return this.forgotPasswordForm.controls.email;
  }
}
