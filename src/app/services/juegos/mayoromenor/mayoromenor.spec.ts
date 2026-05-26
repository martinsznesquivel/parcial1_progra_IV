import { TestBed } from '@angular/core/testing';

import { Mayoromenor } from './mayoromenor';

describe('Mayoromenor', () => {
  let service: Mayoromenor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mayoromenor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
