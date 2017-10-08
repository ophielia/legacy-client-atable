import { TestBed, inject } from '@angular/core/testing';

import { DrilldownCommunicationService } from './tag-drilldown-select.service';

describe('DrilldownCommunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrilldownCommunicationService]
    });
  });

  it('should be created', inject([DrilldownCommunicationService], (service: DrilldownCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
