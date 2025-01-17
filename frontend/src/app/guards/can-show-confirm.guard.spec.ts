import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canShowConfirmGuard } from './can-show-confirm.guard';

describe('canShowConfirmGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canShowConfirmGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
