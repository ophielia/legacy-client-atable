import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditPickupListComponent} from './edit-pickup-list.component';

describe('EditPickupListComponent', () => {
  let component: EditPickupListComponent;
  let fixture: ComponentFixture<EditPickupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPickupListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPickupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
