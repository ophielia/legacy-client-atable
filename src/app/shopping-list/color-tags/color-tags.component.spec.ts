import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ColorTagsComponent} from './color-tags.component';

describe('ColorTagsComponent', () => {
  let component: ColorTagsComponent;
  let fixture: ComponentFixture<ColorTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorTagsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
