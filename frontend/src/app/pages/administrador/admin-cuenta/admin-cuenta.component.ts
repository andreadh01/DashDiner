import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentComponent } from 'src/app/components/payment/payment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-cuenta',
  templateUrl: './admin-cuenta.component.html',
  styleUrls: ['./admin-cuenta.component.css'],
})
export class AdminCuentaComponent {
  url: { type: string; url: string; blob: string } = {
    type: '',
    url: '',
    blob: '',
  };
  mensaje: any;
  id_administrador: number = 0;
  restaurante: Restaurante = new Restaurante();
  suscrito?: boolean;
  not_suscrito?: boolean;
  restauranteForm = this.formBuilder.group({
    // email: ['', [Validators.required, Validators.email]],
    // username: ['', [Validators.required]],
    // nombre: ['', [Validators.required]],
    // apellido: ['', [Validators.required]],
    // celular: ['', [Validators.required]],
    // password: ['', [Validators.required]],
    // confPassword: ['', [Validators.required]],
    // rfc: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    celular: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    horario: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
  });
  cantidad: number = 0;
  clabe: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: GlobalService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id_administrador = parseInt(this.route.snapshot.parent?.params['id']);
    this.getRestaurante();
    this.service.getMonto(this.id_administrador).subscribe((res) => {
      this.cantidad = res.cantidad;
      this.clabe = res.clabe;
    });
  }

  actualizarRestaurante() {
    const restaurante = {
      ...this.restauranteForm.value,
      logo: this.url,
    };
    console.log(restaurante);
    this.service
      .updateRestaurant(restaurante, this.restaurante.id)
      .subscribe((response) => {
        console.log(response);
        // Handle success, if needed
      });
  }
  getRestaurante() {
    this.service
      .getRestauranteAdmin(this.id_administrador)
      .subscribe((result) => {
        this.url = {
          type: '',
          url: result.restaurante.logo,
          blob: '',
        };
        this.restaurante = result.restaurante;
        if (result.suscrito) {
          this.suscrito = true;
          this.not_suscrito = false;
        } else {
          this.not_suscrito = true;
          this.suscrito = false;
        }
      });
  }

  openModal() {
    var _popup = this.dialog.open(PaymentComponent, {
      panelClass: ['lg:w-[30%]', 'w-[80%]', 'rounded-3xl'],
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        planPremium: true,
      },
    });
    _popup.afterClosed().subscribe((e) => {
      this.getRestaurante();
    });
  }

  cancelarPlan() {
    this.service.cancelarSuscripcion(this.id_administrador).subscribe((res) => {
      this.mensaje = res;
      this.getRestaurante();
    });
  }
  transferir() {
    this.service.transferir(this.id_administrador).subscribe((res) => {
      this.mensaje = res;
      this.cantidad = 0;
    });
  }

  onSelectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = {
          type: e.target.files[0].type,
          url: event.target.result,
          blob: event.target.result.split(',')[1],
        };
        console.log(this.url);
      };
    }
  }
}
