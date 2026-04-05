import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponenet } from './HomeComponenet';

describe('HomeComponenet', () => {
  let component: HomeComponenet;
  let fixture: ComponentFixture<HomeComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponenet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
