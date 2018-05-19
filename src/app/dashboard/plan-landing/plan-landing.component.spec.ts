import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlanLandingComponent} from './plan-landing.component';

describe('PlanLandingComponent', () => {
  let component: PlanLandingComponent;
  let fixture: ComponentFixture<PlanLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlanLandingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
