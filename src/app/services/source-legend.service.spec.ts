import {TestBed, inject} from '@angular/core/testing';

import {SourceLegendService} from './source-legend.service';

describe('SourceLegendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SourceLegendService]
    });
  });

  it('should be created', inject([SourceLegendService], (service: SourceLegendService) => {
    expect(service).toBeTruthy();
  }));
});
