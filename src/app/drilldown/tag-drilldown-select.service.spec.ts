import {inject, TestBed} from "@angular/core/testing";

import {DrilldownCommService} from "./tag-drilldown-select.service";

describe('PocDrilldownCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrilldownCommService]
    });
  });

  it('should be created', inject([DrilldownCommService], (service: DrilldownCommService) => {
    expect(service).toBeTruthy();
  }));
});
