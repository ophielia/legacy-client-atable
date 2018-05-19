import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishFilterSelectComponent} from './dish-filter-select.component';

describe('DishFilterSelectComponent', () => {
  let component: DishFilterSelectComponent;
  let fixture: ComponentFixture<DishFilterSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishFilterSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishFilterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
