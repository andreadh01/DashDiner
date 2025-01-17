import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionFormComponent } from './opcion-form.component';

describe('OpcionFormComponent', () => {
  let component: OpcionFormComponent;
  let fixture: ComponentFixture<OpcionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
