import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Producto } from 'src/app/models/producto';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  @Input() promociones: Producto[] = [];
  @Input() restaurante_nombre?: string = '';
  @Input() restaurante_id?: number = 0;
  constructor(private dialog: MatDialog) {}

  openModal(prod: Producto) {
    this.dialog.open(DialogComponent, {
      width: '80%',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        producto: prod,
        restaurante: this.restaurante_nombre,
        id_restaurante: this.restaurante_id,
      },
    });
  }
}
