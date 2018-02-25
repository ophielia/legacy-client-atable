import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishLandingComponent} from './dish-landing.component';

describe('DishLandingComponent', () => {
  let component: DishLandingComponent;
  let fixture: ComponentFixture<DishLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishLandingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
