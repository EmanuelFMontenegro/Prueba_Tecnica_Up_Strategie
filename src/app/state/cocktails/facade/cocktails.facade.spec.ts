import { TestBed } from '@angular/core/testing';

import { CocktailsFacade } from './cocktails.facade';

describe('CocktailsFacade', () => {
  let service: CocktailsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktailsFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
