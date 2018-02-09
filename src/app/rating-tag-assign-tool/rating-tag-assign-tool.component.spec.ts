import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RatingTagAssignToolComponent} from './rating-tag-assign-tool.component';

describe('RatingTagAssignToolComponent', () => {
  let component: RatingTagAssignToolComponent;
  let fixture: ComponentFixture<RatingTagAssignToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingTagAssignToolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingTagAssignToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
