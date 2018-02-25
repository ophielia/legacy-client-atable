import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDishFinishComponent} from './add-dish-finish.component';

describe('AddDishFinishComponent', () => {
  let component: AddDishFinishComponent;
  let fixture: ComponentFixture<AddDishFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDishFinishComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDishFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
