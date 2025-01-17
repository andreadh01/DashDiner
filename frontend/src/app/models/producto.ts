import { Opcion } from './opcion';

export class Producto {
  id: number = 0;
  id_restaurante?: number;
  id_categoria?: number;
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  estado: boolean = false;
  promocion: boolean = false;
  imagen: string = '';
  opciones: Opcion[] = [];
}
