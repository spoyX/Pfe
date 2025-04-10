import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { expiredGuard } from './expired.guard';

describe('expiredGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => expiredGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
