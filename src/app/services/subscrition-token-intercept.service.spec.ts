import { TestBed } from '@angular/core/testing';

import { SubscritionTokenInterceptService } from './subscrition-token-intercept.service';

describe('SubscritionTokenInterceptService', () => {
  let service: SubscritionTokenInterceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscritionTokenInterceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
