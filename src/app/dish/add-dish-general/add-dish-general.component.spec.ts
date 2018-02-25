import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDishGeneralComponent} from './add-dish-general.component';

describe('AddDishGeneralComponent', () => {
  let component: AddDishGeneralComponent;
  let fixture: ComponentFixture<AddDishGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDishGeneralComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDishGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
