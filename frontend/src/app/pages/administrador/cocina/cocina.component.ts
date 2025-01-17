import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css'],
})
export class CocinaComponent {
  mensaje: any;
  cocineroForm: FormGroup;
  id_administrador: number = 0;
  constructor(
    private fb: FormBuilder,
    private service: GlobalService,
    private route: ActivatedRoute
  ) {
    this.cocineroForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      celular: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
  }
  agregarCocinero() {
    // Lógica para agregar un cocinero
    if (this.cocineroForm.valid) {
      const payload = {
        ...this.cocineroForm.value,
        id_administrador: this.id_administrador,
      };

      console.log(payload);
      this.service.registrarCocina(payload).subscribe((response) => {
        console.log(response);
        this.mensaje = { contenido: response.mensaje, tipo: 'success' };
        this.cocineroForm.reset();
        // Handle success, if needed
      });
    } else {
      // Handle form validation error
    }
  }
}
