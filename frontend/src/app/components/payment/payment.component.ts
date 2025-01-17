import { Component, Input, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { FormControl, Validators } from '@angular/forms';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent {
  @Input() productos: any;
  productos_list: any;
  usuario: any;
  stripe: any;
  client: string = '';
  loaded = false;
  costoTotal: number = 0;
  elements: any;
  clientSecret: any;
  mensaje: any;
  boton_nombre = 'Pagar';
  correo:any;
  paymentIntentId:any;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  private dialogRef;
  private dialogData;

  constructor(
    private service: GlobalService,
    private router: Router,
    private carritoService: CarritoService,
    private injector: Injector
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null);
  }

  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }

  ngOnInit() {
    
    this.usuario = sessionStorage.getItem('usuario');
    if (this.dialogData) {
      if (this.dialogData.planPremium) {
        this.boton_nombre = 'Suscribirme';
        this.crearPlanPremium();
      } else {
        this.productos_list = this.dialogData.productos;
        this.crearIntent();
      }
    } else {
      this.productos_list = this.productos;
      this.crearIntent();
    }
  }

  getEmail(): string {
    this.correo='';
    if (!this.usuario) {
        return (document.getElementById('email') as HTMLInputElement).value;
    } else {
        const user = JSON.parse(this.usuario);
        return user.correo;
    }
}
  confirmPayment() {
    if (!this.stripe || !this.elements) {
      this.mensaje = {
        tipo: 'error',
        contenido: 'Aún no se ha cargado el método de pago',
      };
      return;
    }
    if (!this.usuario && this.emailFormControl.invalid) {
      this.mensaje = {
        tipo: 'error',
        contenido: 'El correo ingresado no es válido',
      };
      return;
    }
    this.stripe
      .confirmPayment({
        elements: this.elements,
        confirmParams: {},
        redirect: 'if_required',
      })
      .then((result: any) => {
        if (result.error) {
          console.log(result);
          this.mensaje = {
            tipo: 'error',
            contenido: result.error.message,
          };
          // Inform the customer that there was an error.
        } else {
          if (this.dialogData) {
            if (this.dialogData.planPremium) {
              if (this.dialogRef) {
                this.mensaje = {
                  contenido: 'Te has suscrito de manera exitosa a DashDiner',
                  tipo: 'success',
                };
                this.dialogRef.close();
              }
            } else {
              this.carritoService.reset();

              // guardar orden
              this.guardarOrden();
            }
          } else {
            this.carritoService.reset();

            // guardar orden
            this.guardarOrden();
          }
        }
      });
  }

  obtenerCorreo(): string {
    if (this.usuario) {
      const user = JSON.parse(this.usuario);
      return user.correo;
    } else {
      const emailElement = document.getElementById('email');
      if (emailElement) {
        return (emailElement as HTMLInputElement).value;
      }
    }
    return 'example@hotmail.com';
  }

  guardarOrden() {
    // crear método del backend
    var correo = '';
    if (!this.usuario) {
      correo = (document.getElementById('email') as HTMLInputElement).value;
    } else {
      const user = JSON.parse(this.usuario);
      console.log(user);
      correo = user.correo;
    }
    
    this.service.updatePaymentIntent(this.paymentIntentId, correo).subscribe((updateResponse) => {
      if (updateResponse.success) {
          // Continuar con la confirmación de la orden y el pago:
          this.service.guardarOrden(this.productos_list, correo).subscribe((res) => {
              console.log(res);
              if (this.dialogRef) {
                  this.dialogRef.close();
              }
              if (res.message) {
                  this.router.navigate(['/gracias']);
              }
          });
      } else {
          // Mostrar un error si no se puede actualizar el PaymentIntent.
          console.error("No se pudo actualizar el PaymentIntent.");
      }
  });
  }

  crearPlanPremium() {
    const usuario = JSON.parse(this.usuario);
    this.service.crearSuscripcion(usuario).subscribe((result: any) => {
      this.createPayment(result.clientSecret);
    });
  }
  crearIntent() {
    const correo = this.obtenerCorreo();
    console.log(correo);
    this.service
      .crearPaymentIntent(this.productos_list)
      .subscribe((result: any) => {
        this.costoTotal = result.costo;
        this.paymentIntentId = result.paymentIntentId;
        this.createPayment(result.clientSecret);
      });
  }
  async createPayment(clientSecret: any) {
    this.stripe = await loadStripe(
      'pk_test_51O4BvmGH50PI9nsFOVkG3Tiy2g2pjOiD3kiARYOhUqi1xOPpH2zRyE5J7VIOK6hekRi9VnIE5XXry7zuh2G0aCv700KWkPUgkX'
    );
    const appearance = {
      theme: 'flat',
      variables: {
        colorBackground: '#375B81',
        colorTextPlaceholder: '#C4C4C4',
        colorText: '#ffff',
        fontFamily: 'Montserrat',
        fontSizeBase: '0.875rem',
      },
    };
    this.elements = this.stripe.elements({ clientSecret, appearance });

    const payment = this.elements.create('payment', {
      business: { name: 'Dashdiner' },
    });

    payment.mount('#payment');
    this.loaded = true;
  }
}
