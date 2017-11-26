import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagTagAssignToolComponent} from './tag-tag-assign-tool.component';

describe('TagTagAssignToolComponent', () => {
  let component: TagTagAssignToolComponent;
  let fixture: ComponentFixture<TagTagAssignToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagTagAssignToolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagTagAssignToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
