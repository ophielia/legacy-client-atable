import {inject, TestBed} from "@angular/core/testing";

import {TagCommService} from "./tag-drilldown-select.service";

describe('PocDrilldownCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagCommService]
    });
  });

  it('should be created', inject([TagCommService], (service: TagCommService) => {
    expect(service).toBeTruthy();
  }));
});
