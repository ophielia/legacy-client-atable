import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RateMealPlanComponent} from './rate-meal-plan.component';

describe('RateMealPlanComponent', () => {
  let component: RateMealPlanComponent;
  let fixture: ComponentFixture<RateMealPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RateMealPlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateMealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
