import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagDrilldownComponent } from './tag-drilldown.component';

describe('TagDrilldownComponent', () => {
  let component: TagDrilldownComponent;
  let fixture: ComponentFixture<TagDrilldownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagDrilldownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
