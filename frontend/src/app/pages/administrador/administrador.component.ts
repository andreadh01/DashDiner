import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css'],
})
export class AdministradorComponent {
  usuario: Usuario = new Usuario();
  //filterNav: any[] = []; // Inicializa filterNav como un arreglo vacío
  constructor(private service: GlobalService) {}

  ngOnInit() {
    this.usuario = this.service.getUser();
    //this.setSidenav();
  }
  ngOnChange() {
    //this.setSidenav();
  }
  // setSidenav() {
  //   // Lógica para definir filterNav basado en el tipo de usuario
  //   if (this.usuario.tipo == 'admin') {
  //     if (!this.service.isSuscrito) {
  //       this.filterNav = [
  //         { name: 'Menú', route: 'menu', icon: 'fastfood' },
  //         { name: 'Categorías', route: 'categorias', icon: 'category' },
  //         { name: 'Órdenes', route: 'ordenes', icon: 'edit_note' },
  //         {
  //           name: 'Detalles de órdenes',
  //           route: 'detalles_ordenes',
  //           icon: 'find_in_page',
  //         },
  //         { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
  //         { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
  //       ];
  //     } else {
  //       this.filterNav = [
  //         { name: 'Dashboard', route: 'dashboard', icon: 'dashboard' },
  //         { name: 'Menú', route: 'menu', icon: 'fastfood' },
  //         { name: 'Categorías', route: 'categorias', icon: 'category' },
  //         { name: 'Órdenes', route: 'ordenes', icon: 'edit_note' },
  //         {
  //           name: 'Detalles de órdenes',
  //           route: 'detalles_ordenes',
  //           icon: 'find_in_page',
  //         },
  //         { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
  //         { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
  //       ];
  //     }
  //   } else if (this.usuario.tipo == 'cocina') {
  //     this.filterNav = [
  //       {
  //         name: 'Detalles de órdenes',
  //         route: 'detalles_ordenes',
  //         icon: 'find_in_page',
  //       },
  //       //    { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
  //       { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
  //     ];
  //   }
  // }
}
