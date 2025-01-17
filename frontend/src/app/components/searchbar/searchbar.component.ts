import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
})
export class SearchbarComponent {
  busqueda = new FormControl('');

  constructor(private router: Router) {}

  buscar() {
    this.router.navigate(['/buscar', this.busqueda.value]);
  }
}
