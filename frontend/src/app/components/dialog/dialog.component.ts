import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Opcion } from 'src/app/models/opcion';
import { Producto } from 'src/app/models/producto';
import { ProductoSeleccionado } from 'src/app/models/productoSeleccionado';
import { Seleccion } from 'src/app/models/seleccion';
import { CarritoService } from 'src/app/services/carrito.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  decimal(n: any) {
    return Number(n).toFixed(2);
  }
  producto: any;
  opciones: Opcion[] = [];
  seleccionado: { nombre: string; precio: number }[] = [];
  mensaje: any;
  totalPrecio: number = 0;
  productoSeleccionado: ProductoSeleccionado = new ProductoSeleccionado();
  prevSelected: Seleccion = new Seleccion();
  closemessage = {
    tipo: 'success',
    contenido: 'Los cambios se han cambiado de manera exitosa.',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private carritoService: CarritoService,
    private ref: MatDialogRef<DialogComponent>,
    private service: GlobalService
  ) {}
  ngOnInit(): void {
    this.producto = this.datos.producto;

    if (this.producto.id > 0) {
      this.totalPrecio = this.producto.precio;
      this.recibirInformacion(this.producto.id);
    }
  }

  recibirInformacion(code: number) {
    this.service.getOpciones(code).subscribe((result: Opcion[]) => {
      this.opciones = result.map((opcion) => {
        opcion.selecciones_disponibles = opcion.selecciones_disponibles.map(
          (seleccion) => {
            if (!seleccion.hasOwnProperty('checked')) {
              seleccion.checked = false;
            }
            return seleccion;
          }
        );
        return opcion;
      });
    });
  }

  closeModal(success = false) {
    var msg = success ? this.closemessage : '';
    this.ref.close(msg);
  }

  guardar() {
    // if (this.datosInput.formGroup.valid) {
    //   this.service.guardarProyector(this.datosInput.formGroup.value).subscribe({
    //     complete: () => {
    //       this.closeModal(true);
    //     }, // completeHandler
    //     error: (e) => {
    //       console.log(e);
    //       this.mensaje = e.error;
    //     }, // errorHandler
    //   });
    // } else {
    //   this.mensaje = {
    //     tipo: 'error',
    //     contenido: 'Por favor, llene todos los campos.',
    //   };
  }

  agregarProducto() {
    this.obtenerSeleccionadas();
    this.productoSeleccionado = {
      id: this.producto.id,
      nombre: this.producto.nombre,
      precio: this.totalPrecio,
      selecciones: this.seleccionado,
      imagen: this.producto.imagen,
      restaurante: this.datos.restaurante,
      restaurante_id: this.datos.id_restaurante,
    };
    this.carritoService.add(this.productoSeleccionado);
    this.closeModal(true);
  }

  calcularTotal() {
    this.producto.precio = parseFloat(this.producto.precio);

    let sumaOpciones = 0;
    this.opciones.forEach((opcion) => {
      opcion.selecciones_disponibles.forEach((seleccion) => {
        if (
          seleccion.checked !== this.prevSelected.checked &&
          typeof seleccion.checked === 'number'
        ) {
          seleccion.checked > this.prevSelected.id
            ? (sumaOpciones -= parseFloat(this.prevSelected.precio.toString()))
            : null;
          this.prevSelected.checked = false;
          this.prevSelected = seleccion;
        }

        if (seleccion.checked) {
          // Asumiendo que tienes un atributo 'checked' en 'seleccion' que indica si está seleccionada o no.
          sumaOpciones += parseFloat(seleccion.precio.toString());
        }
      });
    });
    this.totalPrecio = parseFloat(this.producto.precio) + sumaOpciones;
  }

  obtenerSeleccionadas() {
    this.opciones.forEach((opcion) => {
      opcion.selecciones_disponibles.forEach((seleccion) => {
        if (seleccion.checked) {
          console.log(seleccion);
          this.seleccionado.push({
            nombre: seleccion.nombre,
            precio: seleccion.precio,
          });
        }
      });
    });
  }
}
