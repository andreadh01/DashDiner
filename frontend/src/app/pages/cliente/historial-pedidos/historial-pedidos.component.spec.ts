import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialPedidosComponent } from './historial-pedidos.component';

describe('HistorialPedidosComponent', () => {
  let component: HistorialPedidosComponent;
  let fixture: ComponentFixture<HistorialPedidosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialPedidosComponent]
    });
    fixture = TestBed.createComponent(HistorialPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
