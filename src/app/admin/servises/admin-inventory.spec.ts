import { TestBed } from '@angular/core/testing';

import { AdminInventory } from './admin-inventory';

describe('AdminInventory', () => {
  let service: AdminInventory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminInventory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
