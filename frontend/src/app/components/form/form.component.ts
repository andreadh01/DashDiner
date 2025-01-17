import { Component, Inject, Input } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { GlobalService } from 'src/app/services/global.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpcionFormComponent } from '../opcion-form/opcion-form.component';
import { Opcion } from 'src/app/models/opcion';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  producto: any;
  opciones: Opcion[] = [];
  form: any;
  producto_id: number = 0;
  selectedOption: string | null = null;
  productoGuardado: boolean = false;
  datosInput: any;
  mensaje: any;
  categorias: Categoria[] = [];
  eliminados: number[] = [];
  opcionesArray: FormArray = new FormArray<FormGroup>([]);
  closemessage = {
    tipo: 'success',
    contenido: 'Los cambios se han cambiado de manera exitosa.',
  };
  url = { type: 'image/png', url: '/assets/placeholder.png', blob: '' };
  newOption: string = ''; // To store the user-entered new option

  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private buildr: FormBuilder,
    private ref: MatDialogRef<DialogComponent>,
    private service: GlobalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = this.datos.formGroup;
    this.productoGuardado = false;
    this.service
      .getCategorias(this.datos.id_restaurante)
      .subscribe((result) => {
        this.categorias = result;
      });
    if (this.datos.code > 0) {
      this.productoGuardado = true;
      this.recibirInformacionProducto(this.datos.code);
    }
  }

  onSelectFile(e: any) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (event: any) => {
      this.url = {
        type: e.target.files[0].type,
        url: event.target.result,
        blob: event.target.result.split(',')[1],
      };
      this.form.patchValue({ imagen: this.url });
      console.log(this.url);
    };
  }

  createOpcionFields(): FormGroup {
    return this.buildr.group({
      id: this.buildr.control(0),
      id_producto: this.producto_id,
      titulo: ['', Validators.required],
      multiple: this.buildr.control(false),
      selecciones_disponibles: this.buildr.array([]),
    });
  }

  createSeleccionFields(): FormGroup {
    return this.buildr.group({
      id: this.buildr.control(0),
      id_opcion: this.buildr.control(0),
      nombre: ['', Validators.required],
      precio: [null, Validators.required],
      estado: this.buildr.control(false),
    });
  }

  recibirInformacionOpciones(code: number): void {
    this.service.getOpciones(code).subscribe((result) => {
      this.opciones = result;
      // this.opcionesArray = this.form.get('opciones') as FormArray;

      // result.forEach((opcionData) => {
      //   const opcionGroup = this.buildr.group({
      //     id: opcionData.id,
      //     id_producto: opcionData.id_producto,
      //     multiple: opcionData.multiple,
      //     titulo: opcionData.titulo,
      //     selecciones_disponibles: this.buildr.array([]), // Form array for selecciones_disponibles
      //   });

      //   // Populate selecciones_disponibles
      //   opcionData.selecciones_disponibles.forEach((seleccionData) => {
      //     const seleccionGroup = this.buildr.group({
      //       id: seleccionData.id,
      //       nombre: seleccionData.nombre,
      //       precio: seleccionData.precio,
      //       estado: seleccionData.estado,
      //     });

      //     (opcionGroup.get('selecciones_disponibles') as FormArray).push(
      //       seleccionGroup
      //     );
      //   });

      //   this.opcionesArray.push(opcionGroup);
      // });
    });
  }
  recibirInformacionProducto(code: number) {
    this.service.getProducto(code).subscribe((result) => {
      this.producto = result;
      this.producto_id = this.producto.id;
      this.url = { type: 'image/png', url: this.producto.imagen, blob: '' };
      this.recibirInformacionOpciones(this.producto.id);
      this.form.patchValue({
        id: this.producto.id,
        id_categoria: this.producto.id_categoria,
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion,
        precio: this.producto.precio,
        imagen: this.producto.imagen,
        estado: this.producto.estado,
        id_restaurante: this.producto.id_restaurante,
        promocion: this.producto.promocion,
      });
    });

    console.log(this.form);
  }
  closeModal(success = false) {
    var msg = success ? this.closemessage : '';
    this.ref.close(msg);
  }

  guardar() {
    if (this.form.valid) {
      if (this.eliminados.length > 0) {
        this.service.eliminarOpciones(this.eliminados).subscribe({
          complete: () => {}, // completeHandler
          error: (e) => {
            console.log(e);
            this.mensaje = e.error;
          }, // errorHandler
        });
      }
      this.service.guardarProducto(this.form.value).subscribe({
        next: (res) => {
          if (this.productoGuardado) {
            this.closeModal(true);
          } else {
            console.log(res);
            this.mensaje = { contenido: res.mensaje, tipo: 'success' };
            this.productoGuardado = true;
            this.producto_id = res.id;
          }
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

  decimal(n: any) {
    return Number(n).toFixed(2);
  }

  eliminar(index: number, opcion_id: number) {
    this.opciones.splice(index, 1);
    this.eliminados.push(opcion_id);
  }

  openModal(code: number) {
    var _popup = this.dialog.open(OpcionFormComponent, {
      panelClass: ['md:w-fit', 'w-screen'],
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        code: code,
        id_producto: this.producto_id,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      //this.mensaje = item;
      this.recibirInformacionOpciones(this.producto_id);
    });
  }
}
