import { TestBed } from '@angular/core/testing';

import { ConquistaGalactica } from './conquista-galactica';

describe('ConquistaGalactica', () => {
  let service: ConquistaGalactica;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConquistaGalactica);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
