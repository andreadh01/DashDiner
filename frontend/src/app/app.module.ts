import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalService } from './services/global.service';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroClienteComponent } from './pages/registro-cliente/registro-cliente.component';
import { RegistroRestauranteComponent } from './pages/registro-restaurante/registro-restaurante.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AdministradorComponent } from './pages/administrador/administrador.component';
import { HomeComponent } from './pages/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GridComponent } from './components/grid/grid.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { LogoComponent } from './components/logo/logo.component';
import { FormComponent } from './components/form/form.component';
import { AdminMenuComponent } from './pages/administrador/admin-menu/admin-menu.component';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OpcionFormComponent } from './components/opcion-form/opcion-form.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CategoriasComponent } from './pages/administrador/categorias/categorias.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetCodeComponent } from './pages/reset-code/reset-code.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { FourDigitInputDirective } from './pages/reset-code/four-digit-input.directive';
import { GraciasComponent } from './pages/gracias/gracias.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { HistorialOrdenesComponent } from './pages/administrador/historial-ordenes/historial-ordenes.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { HistorialPedidosComponent } from './pages/cliente/historial-pedidos/historial-pedidos.component';
import { CuentaComponent } from './pages/cliente/cuenta/cuenta.component';
import { AdminCuentaComponent } from './pages/administrador/admin-cuenta/admin-cuenta.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TablaComponent } from './components/tabla/tabla.component';
import { MatTableModule } from '@angular/material/table';
import { PaymentComponent } from './components/payment/payment.component';
import { PedidosGridComponent } from './components/pedidos-grid/pedidos-grid.component';
import { CocinaComponent } from './pages/administrador/cocina/cocina.component';
import { DashboardComponent } from './pages/administrador/dashboard/dashboard.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FavoritosComponent } from './pages/cliente/favoritos/favoritos.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchbarComponent,
    BuscarComponent,
    LoginComponent,
    RegistroClienteComponent,
    RegistroRestauranteComponent,
    CarritoComponent,
    MenuComponent,
    AdministradorComponent,
    HomeComponent,
    GridComponent,
    DialogComponent,
    MensajeComponent,
    SidenavComponent,
    LogoComponent,
    FormComponent,
    AdminMenuComponent,
    OpcionFormComponent,
    CarouselComponent,
    CategoriasComponent,
    CategoriaComponent,
    ForgotPasswordComponent,
    ResetCodeComponent,
    NewPasswordComponent,
    FourDigitInputDirective,
    NewPasswordComponent,
    GraciasComponent,
    PedidosComponent,
    HistorialOrdenesComponent,
    ClienteComponent,
    HistorialPedidosComponent,
    CuentaComponent,
    TablaComponent,
    AdminCuentaComponent,
    PaymentComponent,
    PedidosGridComponent,
    CocinaComponent,
    DashboardComponent,
    FavoritosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDividerModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatSelectModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    NgApexchartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],

  providers: [GlobalService],
  bootstrap: [AppComponent],
})
export class AppModule {}
