import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuickPickUpListComponent} from './quick-pick-up-list.component';

describe('QuickPickUpListComponent', () => {
  let component: QuickPickUpListComponent;
  let fixture: ComponentFixture<QuickPickUpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickPickUpListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPickUpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
