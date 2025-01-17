import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { forgotPasswordGuard } from './forgot-password.guard';

describe('forgotPasswordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => forgotPasswordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
