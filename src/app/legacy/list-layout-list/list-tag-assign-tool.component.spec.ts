import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTagAssignToolComponent} from './list-tag-assign-tool.component';

describe('ListTagAssignToolComponent', () => {
  let component: ListTagAssignToolComponent;
  let fixture: ComponentFixture<ListTagAssignToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTagAssignToolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTagAssignToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
