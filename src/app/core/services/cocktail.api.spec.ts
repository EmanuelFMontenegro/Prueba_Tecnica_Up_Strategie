import { TestBed } from '@angular/core/testing';

import { CocktailApi } from './cocktail.api';

describe('CocktailApi', () => {
  let service: CocktailApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktailApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
