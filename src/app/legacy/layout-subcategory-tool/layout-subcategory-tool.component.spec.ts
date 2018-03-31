import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutSubcategoryToolComponent} from './layout-subcategory-tool.component';

describe('LayoutSubcategoryToolComponent', () => {
  let component: LayoutSubcategoryToolComponent;
  let fixture: ComponentFixture<LayoutSubcategoryToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutSubcategoryToolComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSubcategoryToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
