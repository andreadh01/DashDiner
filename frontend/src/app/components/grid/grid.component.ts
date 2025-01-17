import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { DialogComponent } from '../dialog/dialog.component';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';
import { Categoria } from 'src/app/models/categoria';
import { Usuario } from 'src/app/models/usuario';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent {
  @Input() restaurante_nombre?: string = '';
  @Input() restaurante_id?: number = 0;
  @Input() restaurante?: boolean;
  @Input() editable?: boolean;
  @Input() producto?: boolean;
  @Input() categoria?: boolean;
  @Output() editar = new EventEmitter();
  @Output() cambiados = new EventEmitter<Producto>();
  @Input() items: any[] = [];
  mensaje: any;
  @Input() busqueda: boolean = false;
  @Output() seleccionado = new EventEmitter<Producto>();
  itemSeleccionado?: Producto;
  usuario: Usuario = new Usuario();
  favoritos: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private service: GlobalService
  ) {}
  ngOnInit() {
    const user = sessionStorage.getItem('usuario');
    if (user) {
      this.usuario = JSON.parse(user);
      if (this.usuario.tipo == 'cliente' && !this.busqueda) {
        this.getProductosFavoritos(this.usuario.id);
      }
    }
  }
  navigate(id: number) {
    this.router.navigate(['ver-menu/' + id]);
  }

  getProductosFavoritos(id_cliente: number) {
    this.service.getProductosFavoritos(id_cliente).subscribe((response) => {
      this.favoritos.next(response.id_list);
    });
  }

  isFavorito(prod: Producto): boolean {
    return this.favoritos.value.includes(prod.id);
  }

  seleccionar(prod: Producto) {
    this.openModal(prod, DialogComponent);
  }

  desactivarProducto(prod: Producto) {
    this.openModal(prod, DialogComponent);
  }

  addToFavorites(product: Producto): void {
    this.service
      .addProductoFavorito(product.id, this.usuario.id)
      .subscribe((response) => {
        const prev = this.favoritos.value;
        this.favoritos.next([...prev, product.id]);
      });
  }

  removeFromFavorites(product: Producto): void {
    this.service
      .removeProductoFavorito(product.id, this.usuario.id)
      .subscribe((response) => {
        const prev = this.favoritos.value;
        prev.splice(prev.indexOf(product.id), 1);
        this.favoritos.next(prev);
      });
  }
  eliminarCategoria(cat: Categoria, index: number) {
    this.service.eliminarCategoria(cat).subscribe({
      complete: () => {
        this.items.splice(index, 1);
      }, // completeHandler
      error: (e: any) => {
        console.log(e);
        this.mensaje = e.error;
      }, // errorHandler
    });
  }

  editarCategoria(cat: Categoria) {
    this.editar.emit(cat);
  }
  editarProducto(prod: Producto) {
    this.editar.emit(prod);
  }

  openModal(prod: Producto, component: any) {
    var _popup = this.dialog.open(component, {
      width: '80%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        producto: prod,
        restaurante: this.restaurante_nombre,
        id_restaurante: this.restaurante_id,
      },
    });
    _popup.afterClosed().subscribe((item) => {
      this.mensaje = item;
    });
  }

  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }
  //@Output() seleccionado = new EventEmitter<Restaurante>();
  //restSeleccionado?: Restaurante;
  // ngOnChanges() {
  //   this.restSeleccionado = undefined;
  // }

  // seleccionar(restaurante: Restaurante) {
  //   this.restSeleccionado = restaurante;
  //   this.seleccionado.emit(restaurante);
  // }

  cambiarEstado(prod: Producto) {
    prod.estado = !prod.estado;

    this.cambiados.emit(prod);

    this.service.guardarProducto(prod).subscribe((response) => {
      //this.mensaje = response;
    });
  }
}
