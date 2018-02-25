import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageDishComponent} from './manage-dish.component';

describe('ManageDishComponent', () => {
  let component: ManageDishComponent;
  let fixture: ComponentFixture<ManageDishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDishComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
