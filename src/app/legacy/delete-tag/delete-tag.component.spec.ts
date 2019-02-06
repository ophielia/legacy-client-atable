import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteTagComponent} from './dinner-tonight-on-hand.component';

describe('DinnerTonightOnHandComponent', () => {
  let component: DeleteTagComponent;
  let fixture: ComponentFixture<DeleteTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteTagComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
