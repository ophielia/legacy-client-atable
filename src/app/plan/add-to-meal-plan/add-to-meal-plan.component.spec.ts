import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddToMealPlanComponent} from './add-to-meal-plan.component';

describe('AddToMealPlanComponent', () => {
  let component: AddToMealPlanComponent;
  let fixture: ComponentFixture<AddToMealPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddToMealPlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToMealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
