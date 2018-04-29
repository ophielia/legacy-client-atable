import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditDisplayCategoryComponent} from './edit-display-category.component';

describe('EditDisplayCategoryComponent', () => {
  let component: EditDisplayCategoryComponent;
  let fixture: ComponentFixture<EditDisplayCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditDisplayCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDisplayCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
