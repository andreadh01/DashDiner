import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentComponent } from 'src/app/components/payment/payment.component';
import { ProductoSeleccionado } from 'src/app/models/productoSeleccionado';
import { CarritoService } from 'src/app/services/carrito.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  usuario: any;
  stripe: any;
  productos: { producto: ProductoSeleccionado; cantidad: number }[] = [];
  client: string = '';
  loaded = false;
  elements: any;
  mensaje: any;
  modal: boolean = false;
  public innerWidth: any;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  get costoTotal() {
    var costo = 0;
    this.productos.forEach((item) => {
      costo += item.producto.precio * item.cantidad;
    });
    return costo;
  }
  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }

  ngOnInit() {
    this.productos = this.carritoService.productos;
    this.innerWidth = window.innerWidth;
    this.innerWidth < 1024 ? (this.modal = true) : (this.modal = false);
  }

  agregar(prod: ProductoSeleccionado) {
    this.carritoService.add(prod);
  }

  openModal() {
    this.modal = true;
    var _popup = this.dialog.open(PaymentComponent, {
      width: '80%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        productos: this.productos,
      },
    });
  }
  eliminar(item: any) {
    var valor = item.cantidad - 1;
    if (valor > 0) {
      this.carritoService.remove(item.producto);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.innerWidth < 1024 ? (this.modal = true) : (this.modal = false);
  }
  eliminarProducto(prod: ProductoSeleccionado) {
    this.productos.forEach((item, index) => {
      if (JSON.stringify(item.producto) === JSON.stringify(prod)) {
        this.productos.splice(index, 1);
        this.carritoService.removeProduct(index);
      }
    });
  }

  decimal(n: any) {
    return Number(n).toFixed(2);
  }
}
