import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CocktailsEffects } from './effects/cocktails.effects';
import { cocktailsFeatureKey, reducer as cocktailsReducer } from './reducers/cocktails.reducer';

export const provideCocktailsState = () => ([
  provideState(cocktailsFeatureKey, cocktailsReducer),
  provideEffects(CocktailsEffects),
]);
