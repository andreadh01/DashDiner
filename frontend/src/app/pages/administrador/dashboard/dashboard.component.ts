import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { ApexOptions, ApexAxisChartSeries } from 'ng-apexcharts';
import { ActivatedRoute } from '@angular/router';
import { Restaurante } from 'src/app/models/restaurante';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  fechaInicio: FormControl = new FormControl('');
  bestSellers: any[] = [];
  selected: string = 'day';
  restaurante: Restaurante = new Restaurante();
  clientCount: number = 0;
  id_administrador: number = 0;
  filtroForm: FormGroup;
  articulosFavoritosLabel: string[] = [];
  categories: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  articulosFavoritos: any[] = []; // Array to store monthly revenue data
  monthlyRevenueData: ApexAxisChartSeries = [
    {
      name: 'Ventas',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ]; // Array to store monthly revenue data
  clientsPerMonth: ApexAxisChartSeries = [
    {
      name: 'Número de clientes',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ]; // Array to store monthly revenue data

  donutChartOptions: ApexOptions = {
    series: [],
    labels: [],
    chart: {
      type: 'donut',
      height: 400,
    },
  };

  constructor(
    private dataService: GlobalService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
    });
  }

  ngOnInit(): void {
    this.fechaInicio.setValue(new Date());

    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
    this.getRestaurante();
  }

  getRestaurante() {
    this.dataService
      .getRestauranteAdmin(this.id_administrador)
      .subscribe((result) => {
        this.restaurante = result.restaurante;
        this.aplicarFiltros(this.selected);
      });
  }

  aplicarFiltros(filtro: string) {
    //this.fechaInicio = this.filtroForm.get('fechaInicio')?.value;
    //this.fechaFin = this.filtroForm.get('fechaFin')?.value;
    console.log(this.fechaInicio.value);
    const dateObject = new Date(this.fechaInicio.value);

    const formattedDate = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

    console.log(formattedDate);

    this.obtenerCantidadClientes(filtro, formattedDate);
    this.getBestSellers(filtro, formattedDate);
    this.obtenerVentas(dateObject.getFullYear());
    this.obtenerArticulosFavoritos();
    this.clientesPorMes(dateObject.getFullYear());
  }

  clientesPorMes(year: number) {
    this.dataService
      .getClientsPerMonth(this.restaurante.id, year)
      .subscribe((response) => {
        this.clientsPerMonth = [
          {
            name: 'Número de clientes',
            data: response.data,
          },
        ];
      });
  }

  get ganancias() {
    var total = 0;
    this.bestSellers.forEach((p) => {
      total += p.precio * p.ventas;
    });
    return total;
  }

  get ordenesTotales() {
    var total = 0;
    this.bestSellers.forEach((p) => {
      total += parseInt(p.ventas);
    });
    return total;
  }
  obtenerCantidadClientes(filter: string, date: string) {
    this.dataService
      .getClientCount(this.restaurante.id, filter, date)
      .subscribe((response) => {
        this.clientCount = response.client_count;
      });
  }

  getBestSellers(filter: string, date: string) {
    this.dataService
      .getBestSellers(this.restaurante.id, filter, date)
      .subscribe((res) => {
        // Handle the data and update the chart
        this.bestSellers = res.data;
        console.log(this.bestSellers);
        //console.log('Best Sellers Data:', data);
      });
  }

  obtenerVentas(year: number) {
    this.dataService
      .getRestaurantRevenue(this.restaurante.id, year)
      .subscribe((response) => {
        this.monthlyRevenueData = [
          { name: 'Ventas', data: response.revenue_data },
        ];
        console.log(this.monthlyRevenueData);
      });
  }

  obtenerCantidadPedidos() {
    // this.dataService
    //   .obtenerCantidadPedidos(
    //     this.idRestaurante,
    //     this.fechaInicio,
    //     this.fechaFin
    //   )
    //   .subscribe((response: { cantidad_pedidos: number | undefined }) => {
    //     this.cantidadPedidos = response.cantidad_pedidos;
    //   });
  }

  obtenerArticulosFavoritos() {
    this.dataService.getMostLiked(this.restaurante.id).subscribe((response) => {
      this.donutChartOptions = {
        series: response.data,
        labels: response.labels,
        chart: {
          type: 'donut',
          height: 400,
        },
        colors: ['#f48d06', '#fab74f', '#3898bd', '#8ad1e1', '#133c6c'],
      };
      this.articulosFavoritos = [response.data];
      this.articulosFavoritosLabel = response.labels;
      console.log(this.articulosFavoritos);
      console.log(this.articulosFavoritosLabel);
    });
  }
  // ... (código anterior)

  // Función para actualizar datos de la gráfica de artículos más vendidos
  actualizarGraficaArticulosMasVendidos() {
    //this.barChartLabels = this.articulosMasVendidos?.map((articulo) => `Producto ${articulo.id_producto}`);
    //this.barChartData = [{ data: this.articulosMasVendidos?.map((articulo) => articulo.cantidad_vendida || 0), label: 'Cantidad Vendida' }];
  }
}
