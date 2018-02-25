import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LandingPadComponent} from './landing-pad.component';

describe('LandingPadComponent', () => {
  let component: LandingPadComponent;
  let fixture: ComponentFixture<LandingPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPadComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
