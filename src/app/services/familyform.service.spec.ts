import { TestBed } from '@angular/core/testing';

import { FamilyformService } from './familyform.service';

describe('FamilyformService', () => {
  let service: FamilyformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
