import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {PocTagDrilldownComponent} from "./tag-drilldown.component";

describe('PocTagDrilldownComponent', () => {
  let component: PocTagDrilldownComponent;
  let fixture: ComponentFixture<PocTagDrilldownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocTagDrilldownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocTagDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
