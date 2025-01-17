import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'frontend';
  texto: string = '';

  constructor(private service: GlobalService) {}
  ngOnInit() {
    //sessionStorage.clear();
    //this.service.get().subscribe((result: any) => (this.texto = result));
  }
}
