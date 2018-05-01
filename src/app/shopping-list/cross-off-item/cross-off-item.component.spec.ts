import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CrossOffItemComponent} from './cross-off-item.component';

describe('CrossOffItemComponent', () => {
  let component: CrossOffItemComponent;
  let fixture: ComponentFixture<CrossOffItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CrossOffItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossOffItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
