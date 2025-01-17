import { Seleccion } from './seleccion';

export class Opcion {
  id: number = 0;
  id_producto?: number;
  titulo: string = '';
  multiple: boolean = false; //puede ser de una seleccion o varias
  selecciones_disponibles: Seleccion[] = [];
  checked?: boolean;
}
