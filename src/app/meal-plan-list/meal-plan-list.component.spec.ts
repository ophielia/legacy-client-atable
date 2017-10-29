import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MealPlanListComponent} from './meal-plan-list.component';

describe('MealPlanListComponent', () => {
  let component: MealPlanListComponent;
  let fixture: ComponentFixture<MealPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MealPlanListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
