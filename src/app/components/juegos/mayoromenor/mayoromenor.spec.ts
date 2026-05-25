import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mayoromenor } from './mayoromenor';

describe('Mayoromenor', () => {
  let component: Mayoromenor;
  let fixture: ComponentFixture<Mayoromenor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mayoromenor],
    }).compileComponents();

    fixture = TestBed.createComponent(Mayoromenor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
