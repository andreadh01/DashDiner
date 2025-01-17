import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { LoginComponent } from './pages/login/login.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RegistroClienteComponent } from './pages/registro-cliente/registro-cliente.component';
import { RegistroRestauranteComponent } from './pages/registro-restaurante/registro-restaurante.component';
import { HomeComponent } from './pages/home/home.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminMenuComponent } from './pages/administrador/admin-menu/admin-menu.component';
import { CategoriasComponent } from './pages/administrador/categorias/categorias.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetCodeComponent } from './pages/reset-code/reset-code.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { forgotPasswordGuard } from './guards/forgot-password.guard';
import { GraciasComponent } from './pages/gracias/gracias.component';
import { canShowConfirmGuard } from './guards/can-show-confirm.guard';
import { HistorialOrdenesComponent } from './pages/administrador/historial-ordenes/historial-ordenes.component';
import { AdminCuentaComponent } from './pages/administrador/admin-cuenta/admin-cuenta.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { CocinaComponent } from './pages/administrador/cocina/cocina.component';
import { HistorialPedidosComponent } from './pages/cliente/historial-pedidos/historial-pedidos.component';
import { ClienteAuthGuard } from './guards/cliente-auth.guard';
import { CocinaAuthGuard } from './guards/cocina-auth.guard';
import { DashboardComponent } from './pages/administrador/dashboard/dashboard.component';
import { SubscribedGuard } from './guards/subscribed.guard';
import { FavoritosComponent } from './pages/cliente/favoritos/favoritos.component';
import { CuentaComponent } from './pages/cliente/cuenta/cuenta.component';
const routes: Routes = [
  {
    path: 'admin/:id',
    component: AdministradorComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [SubscribedGuard],
      },
      { path: 'menu', component: AdminMenuComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'ordenes', component: HistorialOrdenesComponent },
      { path: 'cuenta', component: AdminCuentaComponent },
      { path: 'detalles_ordenes', component: PedidosComponent },
      { path: 'cocina', component: CocinaComponent },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  {
    path: ':id/ordenes',
    component: PedidosComponent,
    canActivate: [CocinaAuthGuard],
  },
  {
    path: ':id/cuenta',
    component: CuentaComponent,
    canActivate: [ClienteAuthGuard],
  },
  {
    path: ':id/pedidos',
    component: HistorialPedidosComponent,
    canActivate: [ClienteAuthGuard],
  },
  {
    path: ':id/favoritos',
    component: FavoritosComponent,
    canActivate: [ClienteAuthGuard],
  },
  { path: 'buscar/:texto', component: BuscarComponent },
  { path: 'registro-cliente', component: RegistroClienteComponent },
  { path: 'registro-restaurante', component: RegistroRestauranteComponent },
  {
    path: 'ver-menu/:id',
    component: MenuComponent,
  },
  {
    path: 'gracias',
    component: GraciasComponent,
    canActivate: [canShowConfirmGuard],
  },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'reset-code',
    component: ResetCodeComponent,
    canActivate: [forgotPasswordGuard],
  },
  {
    path: 'new-password',
    component: NewPasswordComponent,
    canActivate: [forgotPasswordGuard],
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
