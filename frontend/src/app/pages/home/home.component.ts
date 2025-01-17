import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurante } from 'src/app/models/restaurante';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  restaurantes: Restaurante[] = [];
  constructor(private service: GlobalService, private router: Router) {}

  ngOnInit() {
    this.loadItems();
    console.log(this.service.User_Data.forEach((value) => console.log(value)));
  }
  loadItems() {
    this.service
      .getAllRestaurantes()
      .subscribe((result: Restaurante[]) => (this.restaurantes = result));
  }
  redirect(pagename: string) {
    this.router.navigate(['/' + pagename]);
  }
}
