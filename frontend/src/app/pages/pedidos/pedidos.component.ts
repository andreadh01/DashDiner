import { Component } from '@angular/core';
import { Orden } from 'src/app/models/orden';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent {
  mensaje: any;
  ordenes: Orden[] = [];
  filteredOrdenes: Orden[] = [];
  usuario: Usuario = new Usuario();
  id_administrador: number = 0;
  searchQuery: string = '';
  constructor(
    private service: GlobalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  logout() {
    // Realiza el proceso de logout aquí, por ejemplo, limpiando la sesión o el token
    // Luego, redirige al usuario a la página de inicio de sesión
    this.service.logout();

    // Redirige al usuario a la página de inicio de sesión (ajusta la ruta según tu configuración)
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    const user = sessionStorage.getItem('usuario');
    if (user) {
      this.usuario = JSON.parse(user);
      if (this.usuario.tipo == 'cocina') {
        this.service.getIdAdmin(this.usuario.id).subscribe((res) => {
          this.id_administrador = res.id;
          this.loadItems();
        });
      } else {
        this.id_administrador = parseInt(
          this.route.snapshot.parent?.params['id']
        );
        this.loadItems();
      }
    }

    // refrescar ordenes cada minuto
    setInterval(() => {
      this.loadItems();
    }, 60000);
    this.filteredOrdenes = [...this.ordenes];
  }
  searchOrdersById() {
    if (this.searchQuery) {
      this.filteredOrdenes = this.ordenes.filter(
        (order) => order.id == +this.searchQuery
      );
    } else {
      this.filteredOrdenes = [...this.ordenes];
    }
  }

  loadItems() {
    if (this.searchQuery) {
      const searchQueryNumber = +this.searchQuery;
      this.service
        .getOrdenesById(searchQueryNumber, this.id_administrador)
        .subscribe((result: Orden[]) => {
          this.ordenes = result;
          this.filteredOrdenes = [...this.ordenes];
        });
    } else {
      this.service
        .getOrdenes(this.id_administrador)
        .subscribe((result: Orden[]) => {
          this.ordenes = result;
          this.ordenes.sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.ordenes = this.ordenes.filter(
            (order) => order.estado !== 'entregado'
          );
        });
    }
  }
}
