import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetFilter } from './alphabet-filter';

describe('AlphabetFilter', () => {
  let component: AlphabetFilter;
  let fixture: ComponentFixture<AlphabetFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphabetFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
