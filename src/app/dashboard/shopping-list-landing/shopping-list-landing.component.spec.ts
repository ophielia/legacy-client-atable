import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShoppingListLandingComponent} from './shopping-list-landing.component';

describe('ShoppingListLandingComponent', () => {
  let component: ShoppingListLandingComponent;
  let fixture: ComponentFixture<ShoppingListLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListLandingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
