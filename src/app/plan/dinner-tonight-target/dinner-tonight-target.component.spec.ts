import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DinnerTonightTargetComponent} from './dinner-tonight-target.component';

describe('DinnerTonightTargetComponent', () => {
  let component: DinnerTonightTargetComponent;
  let fixture: ComponentFixture<DinnerTonightTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DinnerTonightTargetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinnerTonightTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
