import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishWindowComponent} from './dish-window.component';

describe('DishWindowComponent', () => {
  let component: DishWindowComponent;
  let fixture: ComponentFixture<DishWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishWindowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
