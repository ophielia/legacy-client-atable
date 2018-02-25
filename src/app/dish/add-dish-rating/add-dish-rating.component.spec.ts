import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDishRatingComponent} from './add-dish-rating.component';

describe('AddDishRatingComponent', () => {
  let component: AddDishRatingComponent;
  let fixture: ComponentFixture<AddDishRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDishRatingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDishRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
