import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProposalSlotComponentComponent} from './proposal-slot-component.component';

describe('ProposalSlotComponentComponent', () => {
  let component: ProposalSlotComponentComponent;
  let fixture: ComponentFixture<ProposalSlotComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalSlotComponentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSlotComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
