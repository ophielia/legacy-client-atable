import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditListLayoutComponent} from './edit-list-layout.component';

describe('EditListLayoutComponent', () => {
  let component: EditListLayoutComponent;
  let fixture: ComponentFixture<EditListLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditListLayoutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
