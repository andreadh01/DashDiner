import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css'],
})
export class FavoritosComponent {
  productos: Producto[] = [];
  restaurantes: Restaurante[] = [];
  id_cliente: number = 0;
  constructor(private route: ActivatedRoute, private service: GlobalService) {}

  ngOnInit() {
    this.id_cliente = parseInt(this.route.snapshot.params['id']);
    this.getProductosFavoritos();
    this.getRestaurantesFavoritos();
  }
  getProductosFavoritos() {
    this.service
      .getProductosFavoritos(this.id_cliente)
      .subscribe((response) => {
        console.log(response);
        this.productos = response.productos;
      });
  }

  getRestaurantesFavoritos() {
    this.service
      .getRestaurantesFavoritos(this.id_cliente)
      .subscribe((response) => {
        console.log(response);
        this.restaurantes = response.restaurantes;
      });
  }
}
