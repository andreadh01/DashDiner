import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/categoria';
import { GlobalService } from 'src/app/services/global.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent {
  categoria: Categoria = new Categoria();
  categorias: Categoria[] = [];
  form: any;
  mensaje: any;
  closemessage = {
    tipo: 'success',
    contenido: 'Los cambios se han cambiado de manera exitosa.',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private ref: MatDialogRef<DialogComponent>,
    private service: GlobalService
  ) {}

  ngOnInit(): void {
    this.form = this.datos.formGroup;
    this.service
      .getCategorias(this.datos.id_restaurante)
      .subscribe((result: Categoria[]) => {
        this.categorias = result;
      });
    if (this.datos.code > 0) {
      this.recibirInformacion(this.datos.code);
    }
  }

  recibirInformacion(code: number) {
    this.service.getCategoria(code).subscribe((result: Categoria) => {
      this.categoria = result;
      this.form.patchValue({
        id: this.categoria.id,
        id_restaurante: this.categoria.id_restaurante,
        nombre: this.categoria.nombre,
      });
    });
  }

  closeModal(success = false) {
    var msg = success ? this.closemessage : '';
    this.ref.close(msg);
  }

  guardar() {
    if (this.form.valid) {
      this.service.guardarCategoria(this.form.value).subscribe({
        complete: () => {
          this.closeModal(true);
        }, // completeHandler
        error: (e: any) => {
          console.log(e);
          this.mensaje = e.error;
        }, // errorHandler
      });
    } else {
      this.mensaje = {
        tipo: 'error',
        contenido: 'Por favor, llene todos los campos.',
      };
    }
  }
}
