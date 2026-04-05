import { TestBed } from '@angular/core/testing';

import { UserProduct } from './user-product';

describe('UserProduct', () => {
  let service: UserProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
