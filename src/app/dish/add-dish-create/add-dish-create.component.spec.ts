import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDishCreateComponent} from './add-dish-create.component';

describe('AddDishCreateComponent', () => {
  let component: AddDishCreateComponent;
  let fixture: ComponentFixture<AddDishCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDishCreateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDishCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
