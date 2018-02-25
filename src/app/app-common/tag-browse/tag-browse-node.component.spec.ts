import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagBrowseNodeComponent} from './tag-browse-node.component';

describe('TagBrowseNodeComponent', () => {
  let component: TagBrowseNodeComponent;
  let fixture: ComponentFixture<TagBrowseNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagBrowseNodeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagBrowseNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
