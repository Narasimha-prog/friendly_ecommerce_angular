import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSuccessComponenet } from './cart-success.componenet';

describe('CartSuccessComponenet', () => {
  let component: CartSuccessComponenet;
  let fixture: ComponentFixture<CartSuccessComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSuccessComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(CartSuccessComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
