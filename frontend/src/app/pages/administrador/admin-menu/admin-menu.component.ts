import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { FormComponent } from 'src/app/components/form/form.component';
import { Producto } from 'src/app/models/producto';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent {
  @Input() producto?: Producto;
  productos: Producto[] = [];
  prodCambiados: Producto[] = [];
  mensaje: any;
  id_administrador: number = 0;
  grid: boolean = true;
  table: boolean = false;
  restaurante: Restaurante = new Restaurante();

  constructor(
    private service: GlobalService,
    private buildr: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog //public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
    this.loadItems();
    this.getRestaurante();
  }

  agregarProducto() {
    this.openModal(0, 'Agregar Producto', FormComponent);
  }

  editarProducto(proy: Producto) {
    var code = proy.id || 0;
    this.openModal(code, 'Editar Producto', FormComponent);
  }

  changeView(valor: boolean) {
    this.grid = valor;
  }
  openModal(code: number, title: string, component: any) {
    var _popup = this.dialog.open(component, {
      panelClass: ['lg:w-[80%]', 'w-screen'],
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: title,
        code: code,
        id_restaurante: this.restaurante.id,
        tipoProducto: true,
        formGroup: this.buildr.group({
          id: this.buildr.control(0),
          id_restaurante: this.restaurante.id,
          id_categoria: [null, Validators.required],
          nombre: [null, Validators.required],
          descripcion: [null, Validators.required],
          precio: [null, Validators.required],
          imagen: [null, Validators.required],
          estado: this.buildr.control(false),
          promocion: this.buildr.control(false),
          opciones: this.buildr.array([]),
        }),
      },
    });
    _popup.afterClosed().subscribe((item) => {
      this.mensaje = item;
      this.loadItems();
    });
  }

  agregarCambio(proy: Producto) {
    var index = this.prodCambiados.findIndex((obj) => obj.id === proy.id);

    if (index > -1) {
      this.prodCambiados.splice(index, 1);
    } else {
      this.prodCambiados.push(proy);
    }
  }

  guardar() {
    // this.proyCambiados.forEach((proy) => {
    //   this.service.guardarProyector(proy).subscribe((response) => {
    //     this.mensaje = response;
    //     this.proyCambiados = [];
    //   });
    // });
  }

  getRestaurante() {
    this.service
      .getRestauranteAdmin(this.id_administrador)
      .subscribe((result: any) => (this.restaurante = result.restaurante));
  }

  loadItems() {
    this.service
      .getProductos(this.id_administrador)
      .subscribe((result: Producto[]) => (this.productos = result));
  }
}
