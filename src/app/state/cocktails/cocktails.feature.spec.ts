
import { provideCocktailsState } from './cocktails.feature';

describe('provideCocktailsState', () => {
  it('devuelve providers para state y effects', () => {
    const providers = provideCocktailsState();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBe(2);
  });
});
