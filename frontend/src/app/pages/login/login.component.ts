import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service'; // Ajusta la ruta adecuada
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { CarritoService } from 'src/app/services/carrito.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  mensaje: any = null;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private carritoService: CarritoService
  ) {}
  ngOnInit(): void {}
  redirectToRegistration() {
    // Redirige al usuario a la página de registro-cliente
    this.router.navigateByUrl('/registro-cliente'); // Ajusta la ruta según tu configuración
  }
  redirectToForgot_password() {
    // Redirige al usuario a la página de registro-cliente
    this.router.navigateByUrl('/forgot-password'); // Ajusta la ruta según tu configuración
  }
  get email() {
    return this.loginForm.controls.email;
  }
  get password() {
    return this.loginForm.controls.password;
  }
  login() {
    if (this.loginForm.valid) {
      const correo = this.loginForm.controls.email.value || ''; // Obtén el correo del usuario desde tu formulario
      const password = this.loginForm.controls.password.value || ''; // Obtén la contraseña del usuario desde tu formulario

      // Llama al método login de GlobalService
      this.globalService.login(correo, password).subscribe((response) => {
        console.log(response);
        if (response.logeado) {
          // Autenticación exitosa, redirige a la página de inicio (home)
          if (response.tipo == 'cliente') {
            this.router.navigateByUrl('/');
          }
          if (response.tipo == 'admin') {
            this.router.navigateByUrl(`/administrador/${response.id}`);
          }
          if (response.tipo == 'cocina') {
            this.router.navigateByUrl('/cocina');
          }

          this.loginForm.reset();
          this.globalService.setLogeado(true);
          sessionStorage.setItem('usuario', JSON.stringify(response));
          this.carritoService.eliminarCarrito();
          this.carritoService.setUserId('id_del_usuario');
          
          //setLogeado(true);
          console.log(this.globalService.logeado);
        } else {
          this.mensaje = {
            tipo: 'error',
            contenido: response.mensaje,
          };

          // Autenticación fallida, maneja el error o muestra un mensaje al usuario
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.mensaje = {
        tipo: 'error',
        contenido: 'Por favor, ingrese todos los datos correctamente',
      };
    }
  }
  // Aquí puedes utilizar globalService.login() para hacer la solicitud HTTP
  // onLoginClick() {
  // const correo = (document.getElementById('email') as HTMLInputElement).value;; // Obtén el correo del usuario desde tu formulario
  // const password = (document.getElementById('password') as HTMLInputElement).value;; // Obtén la contraseña del usuario desde tu formulario

  // // Llama al método login de GlobalService
  // this.globalService.login(correo, password).subscribe(response => {
  //   if (response.logeado) {
  //     // Autenticación exitosa, redirige a la página de inicio (home)

  //     this.router.navigate(['/']); // Ajusta la ruta de inicio según tu configuración
  //     setLogeado(true);
  //     console.log(this.globalService.getLogeado());
  //   } else {
  //     // Autenticación fallida, maneja el error o muestra un mensaje al usuario
  //   }
  //   });
  // }
}
// function setLogeado(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
