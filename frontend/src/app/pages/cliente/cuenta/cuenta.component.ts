import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css'],
})
export class CuentaComponent {
  usuario: Usuario = new Usuario();
  registroForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    celular: ['', [Validators.required]],
  }); //este objeto se usa para validar el formulario de registro de cliente
  mensaje: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: GlobalService
  ) {}

  ngOnInit() {
    const user = sessionStorage.getItem('usuario');
    if (user) {
      this.usuario = JSON.parse(user);
      console.log(this.usuario);
    }
  }

  actualizarUsuario() {
    this.service
      .updateUser(this.registroForm.value, this.usuario.id)
      .subscribe((response) => {
        if (response.user) {
          sessionStorage.setItem('usuario', JSON.stringify(response.user));
          this.mensaje = { contenido: response.mensaje, tipo: response.tipo };
        } else {
          this.mensaje = { contenido: response.mensaje, tipo: response.tipo };
        }

        // Handle success, if needed
      });
  }
}
