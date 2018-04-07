import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditMealPlanComponent} from './edit-meal-plan.component';

describe('EditMealPlanComponent', () => {
  let component: EditMealPlanComponent;
  let fixture: ComponentFixture<EditMealPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditMealPlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMealPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
