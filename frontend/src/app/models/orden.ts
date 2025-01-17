import { ItemsOrden } from './items_orden';

export class Orden {
  id: number = 0;
  id_restaurante: number = 0;
  correo: string = '';
  fecha: Date = new Date();
  precio_total: number = 0;
  estado: string = '';
  pagado: boolean = false;
  items: ItemsOrden[] = [];
}
