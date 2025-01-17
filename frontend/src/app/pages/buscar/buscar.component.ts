import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent {
  texto: string = '';
  constructor(private route: ActivatedRoute, private service: GlobalService) {}
  productos: Producto[] = [];
  restaurantes: Restaurante[] = [];
  ngOnInit(): void {
    //var param = this.route.snapshot.paramMap.get('texto');
    this.route.params.subscribe((params) => {
      // Handle the updated search string
      const search = params['texto'];
      this.getBusqueda(search);
    });
    //this.texto = typeof param == 'string' ? param : '';
    //this.getBusqueda();
  }

  getBusqueda(search: string) {
    this.service.getBusquedaItems(search).subscribe((response) => {
      console.log(response);
      this.productos = response.productos;
      this.restaurantes = response.restaurantes;
    });
  }
}
