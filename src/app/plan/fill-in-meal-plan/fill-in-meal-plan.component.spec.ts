import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FillInMealPlanComponent} from './fill-in-meal-plan.component';

describe('FillInMealPlanComponent', () => {
  let component: FillInMealPlanComponent;
  let fixture: ComponentFixture<FillInMealPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FillInMealPlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillInMealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
