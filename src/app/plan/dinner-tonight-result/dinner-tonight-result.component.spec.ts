import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DinnerTonightResultComponent} from './dinner-tonight-result.component';

describe('DinnerTonightResultComponent', () => {
  let component: DinnerTonightResultComponent;
  let fixture: ComponentFixture<DinnerTonightResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DinnerTonightResultComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinnerTonightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
