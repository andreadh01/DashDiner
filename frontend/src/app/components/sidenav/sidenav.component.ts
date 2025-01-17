import { Component, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { Usuario } from 'src/app/models/usuario';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  isExpanded = true;
  filterNav: {
    name: string;
    route: string;
    icon: string;
  }[] = [];
  usuario: Usuario = new Usuario();
  @ViewChild('drawer') drawer: any;

  public selectedItem: string = '';
  public isMobileLayout = window.innerWidth <= 991;
  logeado: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private carrito: CarritoService
  ) {}

  setSidenav() {
    // Lógica para definir filterNav basado en el tipo de usuario
    if (this.usuario.tipo == 'admin') {
      if (!this.globalService.isSuscrito) {
        this.filterNav = [
          { name: 'Menú', route: 'menu', icon: 'fastfood' },
          { name: 'Categorías', route: 'categorias', icon: 'category' },
          { name: 'Órdenes', route: 'ordenes', icon: 'edit_note' },
          {
            name: 'Detalles de órdenes',
            route: 'detalles_ordenes',
            icon: 'find_in_page',
          },
          { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
          { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
        ];
      } else {
        this.filterNav = [
          { name: 'Dashboard', route: 'dashboard', icon: 'dashboard' },
          { name: 'Menú', route: 'menu', icon: 'fastfood' },
          { name: 'Categorías', route: 'categorias', icon: 'category' },
          { name: 'Órdenes', route: 'ordenes', icon: 'edit_note' },
          {
            name: 'Detalles de órdenes',
            route: 'detalles_ordenes',
            icon: 'find_in_page',
          },
          { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
          { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
        ];
      }
    } else if (this.usuario.tipo == 'cocina') {
      this.filterNav = [
        {
          name: 'Detalles de órdenes',
          route: 'detalles_ordenes',
          icon: 'find_in_page',
        },
        //    { name: 'Cocina', route: 'cocina', icon: 'kitchen' },
        { name: 'Mi Cuenta', route: 'cuenta', icon: 'account_circle' },
      ];
    }
  }
  logout() {
    // Realiza el proceso de logout aquí, por ejemplo, limpiando la sesión o el token
    // Luego, redirige al usuario a la página de inicio de sesión
    this.globalService.logout();
    this.carrito.eliminarCarrito();
    // Redirige al usuario a la página de inicio de sesión (ajusta la ruta según tu configuración)
    this.router.navigateByUrl('/login');
  }
  ngOnInit() {
    window.onresize = () => {
      this.isMobileLayout = window.innerWidth <= 991;
      if (this.isMobileLayout) {
        this.isExpanded = true;
      }
    };
    const userObjString = sessionStorage.getItem('usuario');
    if (userObjString) {
      const userObj = JSON.parse(userObjString);
      this.usuario = userObj;
      // Establece el estado de autenticación u otras lógicas relacionadas con el usuario
      // por ejemplo, establecer una variable loggedIn en tu servicio de autenticación
      this.globalService.setLogeado(true);
      // También puedes almacenar el objeto del usuario en un servicio para acceder desde otros componentes
      this.globalService.setUsuario(userObj);
      this.logeado = this.globalService.logeado;
    }
    this.setSidenav();
  }
  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }
}
