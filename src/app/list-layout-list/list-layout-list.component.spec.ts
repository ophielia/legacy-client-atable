import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListLayoutListComponent} from './list-layout-list.component';

describe('ListLayoutListComponent', () => {
  let component: ListLayoutListComponent;
  let fixture: ComponentFixture<ListLayoutListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListLayoutListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
