import { Component } from '@angular/core';
import { Orden } from 'src/app/models/orden';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historial-pedidos',
  templateUrl: './historial-pedidos.component.html',
  styleUrls: ['./historial-pedidos.component.css'],
})
export class HistorialPedidosComponent {
  mensaje: any;
  ordenes: Orden[] = [];
  id_cliente: number = 0;
  usuario: any;
  correo:any;

  constructor(private service: GlobalService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // console.log(this.getEmail());
    this.id_cliente = parseInt(this.route.snapshot.params['id']);
    this.loadItems();

    const usuarioLogeado = this.service.getUser();
    if(usuarioLogeado && usuarioLogeado.correo) {
      this.service.getOrdenesPorCorreo(usuarioLogeado.correo).subscribe(
        (res) => {
          this.ordenes = res;
        },
        (err) => {
          console.error('Error al obtener las órdenes:', err);
        }
      );
    }
  } 
  
  getEmail(): string {
    this.correo='';
    this.usuario = sessionStorage.getItem('usuario');
    this.correo = JSON.parse(this.usuario).correo;
    return this.correo;
  }
  loadItems() {
    // console.log(this.getEmail());
    this.service
      .getOrdenesPorCorreo(this.getEmail())
      .subscribe((result: Orden[]) => {
        this.ordenes = result;
        this.ordenes.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      });
  }
}
