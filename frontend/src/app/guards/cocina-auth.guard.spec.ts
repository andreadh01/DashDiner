import { TestBed } from '@angular/core/testing';

import { CocinaAuthGuard } from './cocina-auth.guard';

describe('CocinaAuthGuard', () => {
  let guard: CocinaAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CocinaAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
