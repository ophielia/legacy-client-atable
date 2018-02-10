import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishTagAssignToolComponent} from './dish-tag-assign-tool.component';

describe('DishTagAssignToolComponent', () => {
  let component: DishTagAssignToolComponent;
  let fixture: ComponentFixture<DishTagAssignToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishTagAssignToolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishTagAssignToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
