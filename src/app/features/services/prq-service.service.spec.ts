import { TestBed } from '@angular/core/testing';

import { PrqServiceService } from './prq-service.service';

describe('PrqServiceService', () => {
  let service: PrqServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrqServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
