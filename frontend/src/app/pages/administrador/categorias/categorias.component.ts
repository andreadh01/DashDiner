import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CategoriaComponent } from 'src/app/components/categoria/categoria.component';
import { FormComponent } from 'src/app/components/form/form.component';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent {
  mensaje: any;
  id_administrador: number = 0;
  categorias: Categoria[] = [];
  restaurante_id: number = 0;

  constructor(
    private service: GlobalService,
    private buildr: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog //public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
    this.getRestaurante();
  }

  agregarCategoria() {
    this.openModal(0, 'Agregar Categoría', CategoriaComponent);
  }

  editarCategoria(cat: Categoria) {
    var code = cat.id || 0;
    this.openModal(code, 'Editar Categoría', CategoriaComponent);
  }

  openModal(code: number, title: string, component: any) {
    var _popup = this.dialog.open(component, {
      panelClass: ['lg:w-[50%]', 'w-full'],
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        title: title,
        code: code,
        formGroup: this.buildr.group({
          id: this.buildr.control(0),
          id_restaurante: this.restaurante_id,
          nombre: [null, Validators.required],
        }),
      },
    });
    _popup.afterClosed().subscribe((item) => {
      this.mensaje = item;
      this.loadItems(this.restaurante_id);
    });
  }

  eliminar() {
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
      .subscribe((result) => {
        this.restaurante_id = result.restaurante.id;
        this.loadItems(this.restaurante_id);
      });
  }

  loadItems(id: number) {
    this.service.getCategorias(id).subscribe((result) => {
      console.log(result);
      this.categorias = result;
    });
  }
}
