import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddDishIngredientComponent} from './add-dish-ingredient.component';

describe('AddDishIngredientComponent', () => {
  let component: AddDishIngredientComponent;
  let fixture: ComponentFixture<AddDishIngredientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDishIngredientComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDishIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
