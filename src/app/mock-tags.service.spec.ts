import { TestBed, inject } from '@angular/core/testing';

import { MockTagsService } from './mock-tags.service';

describe('MockTagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockTagsService]
    });
  });

  it('should be created', inject([MockTagsService], (service: MockTagsService) => {
    expect(service).toBeTruthy();
  }));
});
