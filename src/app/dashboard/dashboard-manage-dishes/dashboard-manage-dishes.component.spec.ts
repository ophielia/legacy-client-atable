import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardManageDishesComponent} from './dashboard-manage-dishes.component';

describe('DashboardManageDishesComponent', () => {
  let component: DashboardManageDishesComponent;
  let fixture: ComponentFixture<DashboardManageDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardManageDishesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManageDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
