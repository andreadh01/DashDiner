import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
})
export class TablaComponent {
  @Input() displayedColumns!: {
    key: string;
    header: string;
  }[];
  @Input() selection: any;
  @Input() dataSource: any;
  @Output() itemAEditar = new EventEmitter();
  @Output() cambiados = new EventEmitter();
  displayedColumnsKeys: string[] = [];
  console = console;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  ngOnChanges() {
    this.displayedColumnsKeys = this.displayedColumns.map((col) => col.key);
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }
  editar(item: any) {
    this.itemAEditar.emit(item);
  }

  actualizar(event: any, item: any) {
    console.log(event.target.value);
    item.estado = event.target.value;

    this.cambiados.emit(item);
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
  decimal(n: any) {
    return Number(n).toFixed(2);
  }
}
