import { Component, Input } from '@angular/core';
import { Orden } from 'src/app/models/orden';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-pedidos-grid',
  templateUrl: './pedidos-grid.component.html',
  styleUrls: ['./pedidos-grid.component.css'],
})
export class PedidosGridComponent {
  @Input() ordenes: Orden[] = [];
  @Input() admin: boolean = false;
  mensaje: any;
  constructor(private service: GlobalService) {}

  actualizar(event: any, orden: Orden) {
    orden.estado = event.target.value;
    this.service.actualizarOrden(orden).subscribe((response: any) => {
      this.mensaje = response;
    });
  }

  color(estado: string): string {
    var color = '';

    switch (estado) {
      case 'nuevo':
        color = 'bg-orange-50 text-orange-400';
        break;
      case 'preparando':
        color = 'bg-blue-50 text-blue-400';
        break;
      case 'listo':
        color = 'bg-indigo-50 text-indigo-400';
        break;
      case 'entregado':
        color = 'bg-green-50 text-green-400';
        break;
    }

    return color;
  }
}
