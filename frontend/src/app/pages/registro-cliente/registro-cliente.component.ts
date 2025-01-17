import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css'],
})
export class RegistroClienteComponent {
  mensaje: any;

  registroForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confPassword: ['', [Validators.required]],
  }); //este objeto se usa para validar el formulario de registro de cliente

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  registrarUsuario() {
    console.log(this.registroForm);
    if (this.registroForm.valid) {
      //se obtiene el correo para verificar que no exista en la base de datos
      const correo = this.registroForm.controls.email.value || '';
      //se manda a llamar el metodo de verificacion de existencia de correo de global service
      this.globalService.existingEmail(correo).subscribe((response) => {
        //en caso de que el correo no exista en la base de datos se procede a registrar el usuario
        if (response.existe == false) {
          //se obtienen los datos del formulario
          const nombre = this.registroForm.controls.nombre.value || '';
          const username = this.registroForm.controls.username.value || '';
          const apellido = this.registroForm.controls.apellido.value || '';
          const numeroTelefono = this.registroForm.controls.celular.value || '';
          const password = this.registroForm.controls.password.value || '';
          const password2 = this.registroForm.controls.confPassword.value || '';
          //se verifica que las contraseñas coincidan
          if (password == password2) {
            const Usuario = {
              nombre_usuario: username,
              correo: correo,
              password: password,
              celular: numeroTelefono,
              nombre: nombre,
              apellido: apellido,
              rfc: null,
              tipo: 'cliente',
            };
            //se manda a llamar el metodo de registro de cliente de global service
            this.globalService.registro(Usuario).subscribe((response) => {
              //si el usuario se registro correctamente se dirige a la pagina de inicio de sesion o la anterior visitada
              if (response.registrado) {
                this.router.navigate(['/login']);
              } else {
                this.mensaje = {
                  tipo: 'error',
                  contenido:
                    'Ocurrio un error al registrar el usuario, intenta de nuevo',
                };
              }
            });
          } else {
            this.mensaje = {
              tipo: 'error',
              contenido: 'Las contraseñas no coinciden',
            };
          }
        } else {
          this.mensaje = {
            tipo: 'error',
            contenido:
              'El correo con el que te intentaste registrar ya está registrado',
          };
        }
      });
    }
  }
}
