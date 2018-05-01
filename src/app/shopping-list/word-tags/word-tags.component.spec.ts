import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WordTagsComponent} from './word-tags.component';

describe('WordTagsComponent', () => {
  let component: WordTagsComponent;
  let fixture: ComponentFixture<WordTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WordTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
