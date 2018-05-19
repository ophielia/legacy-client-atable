import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DinnerTonightOnHandComponent} from './dinner-tonight-on-hand.component';

describe('DinnerTonightOnHandComponent', () => {
  let component: DinnerTonightOnHandComponent;
  let fixture: ComponentFixture<DinnerTonightOnHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DinnerTonightOnHandComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DinnerTonightOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
