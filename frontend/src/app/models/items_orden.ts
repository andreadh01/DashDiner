import { OpcionesOrden } from './opciones_orden';

export class ItemsOrden {
  id: number = 0;
  id_orden: number = 0;
  nombre: string = '';
  cantidad: number = 0;
  precio_total: number = 0;
  opciones: OpcionesOrden[] = [];
}
