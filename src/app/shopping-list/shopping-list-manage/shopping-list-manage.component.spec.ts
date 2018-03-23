import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageShoppingListComponent} from './shopping-list-manage.component';

describe('ManageShoppingListComponent', () => {
  let component: ManageShoppingListComponent;
  let fixture: ComponentFixture<ManageShoppingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageShoppingListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
