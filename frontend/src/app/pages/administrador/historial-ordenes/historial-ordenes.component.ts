import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Orden } from 'src/app/models/orden';
import { GlobalService } from 'src/app/services/global.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-historial-ordenes',
  templateUrl: './historial-ordenes.component.html',
  styleUrls: ['./historial-ordenes.component.css'],
})
export class HistorialOrdenesComponent {
  id_administrador: number = 0;
  mensaje: any;
  ordenes: Orden[] = [];
  grid = false;
  showSelect = false;
  filteredData: any[] = [];
  searchQuery: string = '';
  selectedFilters: string[] = [
    'nuevo',
    'preparando',
    'listo',
    'entregado',
    'true',
    'false',
  ];
  columnasDisplay = [
    {
      key: 'id',
      header: 'Id',
    },
    {
      key: 'correo',
      header: 'Correo de cliente',
    },
    {
      key: 'fecha',
      header: 'Fecha de compra',
    },
    {
      key: 'precio_total',
      header: 'Precio total',
    },
    {
      key: 'estado',
      header: 'Estado',
    },
    {
      key: 'pagado',
      header: 'Transferido',
    },
  ];
  filterOptions: { value: string; label: string }[] = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'preparando', label: 'Preparando' },
    { value: 'listo', label: 'Listo' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'true', label: 'Transferido' },
    { value: 'false', label: 'En espera' },
  ];

  constructor(private service: GlobalService, private route: ActivatedRoute) {}

  onFilterChange(e: any) {
    console.log(e);
    const checked = e.checked;
    checked
      ? this.selectedFilters.push(e.source.value)
      : this.selectedFilters.splice(
          this.selectedFilters.indexOf(e.source.value),
          1
        );
    this.filterData();
  }

  resetFilter() {
    this.showSelect = !this.showSelect;
    this.selectedFilters = [
      'nuevo',
      'preparando',
      'listo',
      'entregado',
      'true',
      'false',
    ];
    this.filterData();
  }
  searchOrders() {
    this.filteredData = this.ordenes.filter(order => {
      // Comprobamos si es un número para asumir que es una búsqueda por ID
      if (!isNaN(Number(this.searchQuery))) {
        return order.id == +this.searchQuery;
      } else {
        // De lo contrario, asumimos que es una búsqueda por correo
        return order.correo.includes(this.searchQuery);
      }
    });
  }
  filterData() {
    console.log(this.selectedFilters);
    this.filteredData = this.ordenes.filter((item) => {
      return (
        this.selectedFilters.includes(item.estado) ||
        this.selectedFilters.includes(item.pagado.toString())
      );
    });
  }
  ngOnInit(): void {
    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
    this.loadItems();
  }

  actualizar(orden: Orden) {
    this.service.actualizarOrden(orden).subscribe((response: any) => {
      this.mensaje = response;
    });
  }

  loadItems() {
    this.service
      .getOrdenes(this.id_administrador)
      .subscribe((result: Orden[]) => {
        this.filteredData = result;
        this.ordenes = result;
      });
  }
}
