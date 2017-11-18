import {TestBed, inject} from '@angular/core/testing';

import {ListLayoutService} from './list-layout.service';

describe('ListLayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListLayoutService]
    });
  });

  it('should be created', inject([ListLayoutService], (service: ListLayoutService) => {
    expect(service).toBeTruthy();
  }));
});
