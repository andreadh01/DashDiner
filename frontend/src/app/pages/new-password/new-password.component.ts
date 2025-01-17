import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
})
export class NewPasswordComponent implements OnInit {
  password1!: string;
  password2!: string;
  isLowerCaseMet: boolean = false;
  isUpperCaseMet: boolean = false;
  isNumberMet: boolean = false;
  isSymbolMet: boolean = false;
  mensaje: any;
  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  checkPassword() {
    const password = this.password1;

    this.isLowerCaseMet = /[a-z]/.test(password);
    this.isUpperCaseMet = /[A-Z]/.test(password);
    this.isNumberMet = /\d/.test(password);
    this.isSymbolMet = /[@$!%*?&]/.test(password);
  }
  changePassword() {
    // Perform password change logic
  }

  get passwordsMatch() {
    return this.password1 === this.password2;
  }
  get isPasswordValid() {
    return (
      this.isLowerCaseMet &&
      this.isUpperCaseMet &&
      this.isNumberMet &&
      this.isSymbolMet
    );
  }

  // Manejar el envío del formulario
  new_password(): void {
    const session = sessionStorage.getItem('reset_code');
    if (session) {
      const sessionJson = JSON.parse(session);
      const correo = sessionJson.correo;
      if (this.passwordsMatch && this.isPasswordValid) {
        const newPassword = (
          document.getElementById('password1') as HTMLInputElement
        ).value;

        this.globalService
          .resetPassword(correo, newPassword)
          .subscribe((response) => {
            this.router.navigateByUrl('/login');
            sessionStorage.removeItem('reset_code');
          });

        // Realiza la lógica para cambiar la contraseña aquí
      } else {
        this.mensaje = {
          tipo: 'error',
          contenido: 'Las contraseñas no coinciden',
        };

        // Muestra un mensaje de error o realiza alguna acción cuando las contraseñas no son válidas o no coinciden
      }
    }
  }
}
