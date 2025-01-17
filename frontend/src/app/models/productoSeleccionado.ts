export class ProductoSeleccionado {
  id?: number = 0;
  restaurante_id: number = 0;
  restaurante: string = '';
  nombre: string = '';
  precio: number = 0;
  imagen: string = '';
  selecciones: { nombre: string; precio: number }[] = [];
}
