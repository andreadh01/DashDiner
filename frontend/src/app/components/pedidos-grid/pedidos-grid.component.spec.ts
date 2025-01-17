import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosGridComponent } from './pedidos-grid.component';

describe('PedidosGridComponent', () => {
  let component: PedidosGridComponent;
  let fixture: ComponentFixture<PedidosGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidosGridComponent]
    });
    fixture = TestBed.createComponent(PedidosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
