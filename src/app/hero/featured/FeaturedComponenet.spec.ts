import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedComponenet } from './FeaturedComponenet';

describe('FeaturedComponenet', () => {
  let component: FeaturedComponenet;
  let fixture: ComponentFixture<FeaturedComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
