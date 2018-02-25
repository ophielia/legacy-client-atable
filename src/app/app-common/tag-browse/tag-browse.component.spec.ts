import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagBrowseComponent} from './tag-browse.component';

describe('TagBrowseComponent', () => {
  let component: TagBrowseComponent;
  let fixture: ComponentFixture<TagBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagBrowseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
