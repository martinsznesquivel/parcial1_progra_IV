import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConquistaGalactica } from './conquista-galactica';

describe('ConquistaGalactica', () => {
  let component: ConquistaGalactica;
  let fixture: ComponentFixture<ConquistaGalactica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConquistaGalactica],
    }).compileComponents();

    fixture = TestBed.createComponent(ConquistaGalactica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
