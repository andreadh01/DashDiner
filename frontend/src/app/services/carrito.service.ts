import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoSeleccionado } from '../models/productoSeleccionado';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private _userId: string | null = null;
  private _productos: { producto: ProductoSeleccionado; cantidad: number }[];
  
  constructor() {
    this._productos = this.cargarCarrito();
    this._productos = JSON.parse(localStorage.getItem('carrito') || '[]'); // get the data at lunch
  }

  reset() {
    localStorage.removeItem('carrito');
    this._productos = [];
  }
  setUserId(userId: string) {
    this._userId = userId;
    this._productos = this.cargarCarrito();
  }

  private cargarCarrito(): { producto: ProductoSeleccionado; cantidad: number }[] {
    if (this._userId) {
      return JSON.parse(localStorage.getItem(`carrito_${this._userId}`) || '[]');
    }
    return [];
  }


  remove(producto: ProductoSeleccionado) {
    this._productos.forEach((item, index) => {
      if (JSON.stringify(item.producto) === JSON.stringify(producto)) {
        item.cantidad -= 1;
      }
      if (item.cantidad == 0) {
        this._productos.splice(index, 1);
      }
    });
    this.syncProductos();
  }

  removeProduct(index: number) {
    this._productos.splice(index, 1);
    this.syncProductos();
  }

  add(producto: ProductoSeleccionado) {
    console.log(this._productos);
    var existe = false;
    this._productos.forEach((item) => {
      if (JSON.stringify(item.producto) === JSON.stringify(producto)) {
        existe = true;
        item.cantidad += 1;
        console.log(this._productos);
      }
    });

    if (!existe) {
      this._productos.push({ producto: producto, cantidad: 1 });
    }
    console.log(this._productos);
    this.syncProductos();
  }

  get length(): number {
    var cantidad = 0;
    this._productos.forEach((item) => {
      cantidad += item.cantidad;
    });
    return cantidad;
  }

  get productos() {
    return this._productos.slice(0);
  }

  syncProductos() {
    if (this._userId) {
      localStorage.setItem(`carrito_${this._userId}`, JSON.stringify(this._productos)); // sync the data
    }
  }

  eliminarCarrito() {
    this._productos = [];
    this.syncProductos();
  }
}
