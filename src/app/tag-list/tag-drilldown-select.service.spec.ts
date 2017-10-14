import {inject, TestBed} from "@angular/core/testing";

import {PocDrilldownCommunicationService} from "./tag-drilldown-select.service";

describe('PocDrilldownCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PocDrilldownCommunicationService]
    });
  });

  it('should be created', inject([PocDrilldownCommunicationService], (service: PocDrilldownCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
