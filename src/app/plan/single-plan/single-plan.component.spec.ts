import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SinglePlanComponent} from './single-plan.component';

describe('SinglePlanComponent', () => {
  let component: SinglePlanComponent;
  let fixture: ComponentFixture<SinglePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SinglePlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
