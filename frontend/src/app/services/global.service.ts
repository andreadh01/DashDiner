import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { API_URL } from '../env';
import { Restaurante } from '../models/restaurante';
import { catchError, of } from 'rxjs';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
import { Opcion } from '../models/opcion';
import { Seleccion } from '../models/seleccion';
import { Usuario } from '../models/usuario';
import { BehaviorSubject, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProductoSeleccionado } from '../models/productoSeleccionado';
import { Orden } from '../models/orden';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  //logeado: BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  logeado = false;
  suscrito: BehaviorSubject<boolean> = new BehaviorSubject(false);
  UserData: BehaviorSubject<Usuario> = new BehaviorSubject<Usuario>({
    id: 0,
    nombre_usuario: '',
    correo: '',
    celular: '',
    nombre: '',
    apellido: '',
    tipo: '',
    mensaje: '',
    logeado: false,
  });

  constructor(private http: HttpClient) {}

  public getAllRestaurantes(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${API_URL}/restaurantes`);
  }
  public getPromociones(id_restaurante: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${API_URL}/promociones/${id_restaurante}`
    );
  }

  public eliminarCategoria(c: Categoria): Observable<any> {
    return this.http.delete(`${API_URL}/eliminar_categoria`, {
      params: { index: c.id },
    });
  }
  public eliminarSelecciones(eliminados: number[]): Observable<any> {
    return this.http.delete(`${API_URL}/eliminar_selecciones`, {
      params: { indexes: eliminados },
    });
  }

  public eliminarOpciones(eliminados: number[]): Observable<any> {
    return this.http.delete(`${API_URL}/eliminar_opciones`, {
      params: { indexes: eliminados },
    });
  }

  public guardarProducto(prodcuto: any): Observable<any> {
    if (prodcuto.id == 0) {
      return this.http.post(`${API_URL}/producto`, prodcuto);
    }
    return this.http.put(`${API_URL}/producto`, prodcuto);
  }

  public guardarCategoria(cat: any): Observable<any> {
    if (cat.id == 0) {
      return this.http.post(`${API_URL}/categoria`, cat);
    }
    return this.http.put(`${API_URL}/categoria`, cat);
  }

  public guardarOpcion(opcion: any): Observable<any> {
    if (opcion.id == 0) {
      return this.http.post(`${API_URL}/opcion`, opcion);
    }
    return this.http.put(`${API_URL}/opcion`, opcion);
  }

  public getMonto(id_administrador: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/monto_pagar/${id_administrador}`);
  }
  public getOpciones(id_producto: number): Observable<Opcion[]> {
    return this.http.get<Opcion[]>(`${API_URL}/opciones/${id_producto}`);
  }
  public getOpcion(id_producto: number): Observable<Opcion> {
    return this.http.get<Opcion>(`${API_URL}/opcion/${id_producto}`);
  }

  public getProducto(id_producto: number): Observable<Producto> {
    return this.http.get<Producto>(`${API_URL}/producto/${id_producto}`);
  }
  public getProductos(id_administrador: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${API_URL}/productos/${id_administrador}`
    );
  }

  public getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${API_URL}/categoria/${id}`);
  }
  public getMenu(id_restaurante: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${API_URL}/menu/${id_restaurante}`);
  }

  public getCategorias(id_restaurante: number): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(
      `${API_URL}/categorias/${id_restaurante}`
    );
  }

  public getMenuPorCategoria(
    id_restaurante: number,
    id_categoria: number
  ): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      `${API_URL}/menu/${id_restaurante}/${id_categoria}`
    );
  }

  //esto sirve para verificar si el correo ya existe en la base de datos y no se pueda registrar
  public existingEmail(correo: string): Observable<any> {
    const body = { correo: correo };
    // Realiza una solicitud HTTP POST al servidor con el objeto JSON
    return this.http.post<any>(`${API_URL}/existingEmail`, body);
  }

  //esto sirve para registrar conectar el front con el back para el usuario en la base de datos
  // public registro(usuario: any): Observable<any> {
  //   return this.http.post<any>(`${API_URL}/registro/${usuario.tipo}`, usuario);
  // }

  public guardarOrden(orden: any, correo: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/ordenes`, {
      orden: orden,
      correo: correo,
    });
  }

  public updatePaymentIntent(
    paymentIntentId: any,
    correo: string
  ): Observable<any> {
    return this.http.post<any>(`${API_URL}/update-payment-intent`, {
      payment_intent_id: paymentIntentId,
      correo: correo,
    });
  }

  public actualizarOrden(orden: Orden): Observable<any> {
    return this.http.put<any>(`${API_URL}/actualizar_orden`, { orden: orden });
  }

  public getOrdenesCliente(id_administrador: number): Observable<Orden[]> {
    return this.http.get<Orden[]>(
      `${API_URL}/ordenes_cliente/${id_administrador}`
    );
  }
  public getOrdenes(id_administrador: number): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${API_URL}/ordenes/${id_administrador}`);
  }

  public getIdAdmin(id_cocina: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/get_admin_id/${id_cocina}`);
  }
  public getOrdenesById(
    orden_id: number,
    id_administrador: number
  ): Observable<Orden[]> {
    return this.http.get<Orden[]>(
      `${API_URL}/ordenes_id/${orden_id}/${id_administrador}`
    );
  }

  public getOrdenesPorCorreo(correo: string): Observable<Orden[]> {
    const params = new HttpParams().set('correo', correo);
    return this.http.get<Orden[]>(`${API_URL}/ordenes/${correo}`);
  }
  public registro(usuario: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/registro`, {
      usuario: usuario,
    });
  }

  public registroRestaurante(usuario: any, restaurante: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/registroRestaurante`, {
      usuario: usuario,
      restaurante: restaurante,
    });
  }
  public getRestauranteAdmin(id_administrador: number): Observable<any> {
    return this.http.get<any>(
      `${API_URL}/restaurante_admin/${id_administrador}`
    );
  }

  public getRestaurante(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${API_URL}/restaurante/${id}`);
  }

  public crearSuscripcion(customer: Usuario) {
    return this.http.post<any>(`${API_URL}/create-subscription`, {
      customer: customer,
    });
  }

  public cancelarSuscripcion(id_administrador: number) {
    return this.http.post<any>(`${API_URL}/cancel-subscription`, {
      id_administrador,
    });
  }

  public crearPaymentIntent(
    productos: { producto: ProductoSeleccionado; cantidad: number }[]
  ) {
    return this.http.post<any>(`${API_URL}/create-payment-intent`, {
      items: productos,
    });
  }

  public login(correo: string, password: string): Observable<Usuario> {
    const body = { correo: correo, password: password };

    // Realiza una solicitud HTTP POST al servidor con el objeto JSON
    return this.http.post<any>(`${API_URL}/login`, body).pipe(
      map((response: any) => {
        if (response.logeado) {
          const usuario: Usuario = {
            id: response.id,
            nombre_usuario: response.nombre_usuario,
            correo: response.correo,
            celular: '', // Puedes asignar un valor por defecto o tomarlo del servidor si está disponible
            nombre: response.nombre,
            apellido: response.apellido,
            tipo: response.tipo,
            mensaje: response.mensaje,
            logeado: true,
          };
          // Guardar datos en sessionStorage
          this.suscrito.next(response.suscrito);
          this.UserData.next({ ...this.UserData.value, ...usuario });
        }
        return response; // O bien, podrías devolver el objeto 'Usuario' aquí si lo necesitas en el componente
      }),
      catchError((err) => {
        return of(err.error);
      })
    );
  }

  public get User_Data(): Observable<Usuario> {
    return this.UserData.asObservable();
  }

  public get isSuscrito(): boolean {
    return this.suscrito.value;
  }

  public getUser(): Usuario {
    return this.UserData.value;
  }
  public setUsuario(response: any): void {
    if (response.logeado) {
      const usuario: Usuario = {
        id: response.id,
        nombre_usuario: response.nombre_usuario,
        correo: response.correo,
        celular: '', // Puedes asignar un valor por defecto o tomarlo del servidor si está disponible
        nombre: response.nombre,
        apellido: response.apellido,
        tipo: response.tipo,
        mensaje: response.mensaje,
        logeado: true,
      };

      // Guardar datos en sessionStorage
      sessionStorage.setItem('usuario', JSON.stringify(usuario));
      sessionStorage.setItem('suscrito', response.suscrito);
      this.suscrito.next(response.suscrito);
      this.UserData.next(usuario);
    }
  }

  registrarCocina(usuario: any): Observable<any> {
    const url = `${API_URL}/registro_cocina`;
    const payload = { usuario };

    return this.http.post<any>(url, payload);
  }
  setLogeado(value: boolean) {
    this.logeado = value;
  }

  logout() {
    // Realiza la lógica de logout aquí, por ejemplo, limpiando la sesión o el token
    // También puedes restablecer cualquier otro estado de autenticación o usuario
    // Por ejemplo:
    // Establece el estado de autenticación en falso
    this.logeado = false;
    this.UserData.next; // Borra los datos del usuario
    sessionStorage.removeItem('suscrito');

    sessionStorage.removeItem('usuario');
  }

  public forgotPassword(correo: string): Observable<any> {
    return this.http.post(`${API_URL}/forgot-password`, { correo });
  }

  obtenerArticulosFavoritos(
    idRestaurante: number,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio || '')
      .set('fecha_fin', fechaFin || '');
    return this.http.get(
      `${API_URL}/restaurantes/${idRestaurante}/articulos_favoritos`,
      { params }
    );
  }
  obtenerCantidadPedidos(
    idRestaurante: number,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio || '')
      .set('fecha_fin', fechaFin || '');
    return this.http.get(
      `${API_URL}/restaurantes/${idRestaurante}/cantidad_pedidos`,
      { params }
    );
  }

  obtenerVentas(
    idRestaurante: number,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio || '')
      .set('fecha_fin', fechaFin || '');
    return this.http.get(`${API_URL}/restaurantes/${idRestaurante}/ventas`, {
      params,
    });
  }

  obtenerCantidadClientesCompradores(
    idRestaurante: number,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio || '')
      .set('fecha_fin', fechaFin || '');
    return this.http.get(
      `${API_URL}/restaurantes/${idRestaurante}/clientes_compradores`,
      { params }
    );
  }

  getBestSellers(
    restaurantId: number,
    filterType: string,
    date: string
  ): Observable<any> {
    const url = `${API_URL}/best_sellers/${restaurantId}/${filterType}/${date}`;
    return this.http.get(url);
  }

  getMostLiked(restaurantId: number): Observable<any> {
    const url = `${API_URL}/most_liked/${restaurantId}`;
    return this.http.get(url);
  }

  getClientsPerMonth(restaurantId: number, year: number): Observable<any> {
    const url = `${API_URL}/clients_per_month/${restaurantId}/${year}`;
    return this.http.get(url);
  }
  getRestaurantRevenue(restaurantId: number, year: number): Observable<any> {
    const url = `${API_URL}/restaurant_revenue/${restaurantId}/${year}`;
    return this.http.get(url);
  }
  getClientCount(
    restaurantId: number,
    filterType: string,
    date: string
  ): Observable<any> {
    const url = `${API_URL}/client_count/${restaurantId}/${filterType}/${date}`;
    return this.http.get(url);
  }
  public transferir(id_administrador: number): Observable<any> {
    return this.http.post(`${API_URL}/transferir`, { id_administrador });
  }
  addProductoFavorito(
    id_producto: number,
    id_usuario: number
  ): Observable<any> {
    return this.http.post<any>(`${API_URL}/producto_favorito`, {
      id_producto: id_producto,
      id_usuario: id_usuario,
    });
  }

  removeProductoFavorito(
    id_producto: number,
    id_usuario: number
  ): Observable<any> {
    return this.http.delete<any>(`${API_URL}/producto_favorito`, {
      body: { id_producto: id_producto, id_usuario: id_usuario },
    });
  }

  addRestauranteFavorito(
    id_usuario: number,
    id_restaurante: number
  ): Observable<any> {
    return this.http.post<any>(`${API_URL}/restaurante_favorito`, {
      id_restaurante: id_restaurante,
      id_usuario: id_usuario,
    });
  }

  removeRestauranteFavorito(
    id_usuario: number,
    id_restaurante: number
  ): Observable<any> {
    return this.http.delete<any>(`${API_URL}/restaurante_favorito`, {
      body: {
        id_restaurante: id_restaurante,
        id_usuario: id_usuario,
      },
    });
  }

  checkRestauranteFavorito(
    id_usuario: number,
    id_restaurante: number
  ): Observable<any> {
    return this.http.get<any>(
      `${API_URL}/restaurante_favorito/${id_restaurante}/${id_usuario}`
    );
  }
  public resetPassword(correo: string, new_password: string): Observable<any> {
    return this.http.post(`${API_URL}/new_password`, { correo, new_password });
  }

  public getProductosFavoritos(id_cliente: number): Observable<any> {
    return this.http.get<any>(
      `${API_URL}/mis_productos_favoritos/${id_cliente}`
    );
  }
  public updateRestaurant(
    restaurant: any,
    restaurantId: number
  ): Observable<any> {
    const url = `${API_URL}/restaurante/${restaurantId}`;

    // Assuming 'restaurant' is an object containing updated restaurant data
    return this.http.put<any>(url, restaurant);
  }
  public updateUser(user: any, userId: number): Observable<any> {
    const url = `${API_URL}/usuario/${userId}`;

    // Assuming 'user' is an object containing updated user data
    return this.http.put<any>(url, user);
  }
  public getRestaurantesFavoritos(id_cliente: number): Observable<any> {
    return this.http.get<any>(
      `${API_URL}/mis_restaurantes_favoritos/${id_cliente}`
    );
  }

  public getBusquedaItems(texto: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/busqueda/${texto}`);
  }
}
