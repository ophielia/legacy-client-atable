import {TestBed, inject} from '@angular/core/testing';

import {MealPlanService} from './meal-plan.service';

describe('MealPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealPlanService]
    });
  });

  it('should be created', inject([MealPlanService], (service: MealPlanService) => {
    expect(service).toBeTruthy();
  }));
});
