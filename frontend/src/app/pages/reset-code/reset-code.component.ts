import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-reset-code',
  templateUrl: './reset-code.component.html',
  styleUrls: ['./reset-code.component.css'],
})
export class ResetCodeComponent {
  resetCodeForm = this.formBuilder.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });
  mensaje: any;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  get code() {
    return this.resetCodeForm.controls.code;
  }
  resetCode() {
    if (this.resetCodeForm.valid) {
      const code = (document.getElementById('code') as HTMLInputElement).value;
      const reset_code = sessionStorage.getItem('reset_code');
      // El código es válido, puedes realizar alguna acción aquí.
      if (reset_code) {
        const reset_code_obj = JSON.parse(reset_code);
        if (reset_code_obj.codigo == code) {
          this.router.navigateByUrl('/new-password');
        } else {
          this.mensaje = {
            tipo: 'error',
            contenido: 'El código no es correcto',
          };
        }
      } else {
        this.mensaje = { tipo: 'error', contenido: 'El código no es correcto' };
      }
    } else {
      // El código no es válido o no se proporcionó, muestra un mensaje de error.
      this.code.markAsTouched();
      var contenido = 'El código no es correcto';
      if (this.code.errors?.['required']) {
        contenido = 'El código es obligatorio';
      }
      if (this.code.errors?.['pattern']) {
        contenido = 'El código debe ser un número de 4 dígitos';
      }
      this.mensaje = { tipo: 'error', contenido: contenido };
    }
  }
}
