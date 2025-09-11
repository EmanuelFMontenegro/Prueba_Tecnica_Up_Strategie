
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cocktailsFeatureKey, State } from '../reducers/cocktails.reducer';

export const selectCocktailsState = createFeatureSelector<State>(cocktailsFeatureKey);

const selectIds      = createSelector(selectCocktailsState, s => s.ids as ReadonlyArray<string>);
const selectEntities = createSelector(selectCocktailsState, s => s.entities);

export const selectAllCocktails = createSelector(
  selectIds,
  selectEntities,
  (ids, entities) => ids.map(id => entities[id]!).filter(Boolean)
);

export const selectCocktailsLoading = createSelector(selectCocktailsState, s => s.loading);
export const selectSelectedCocktail = createSelector(selectCocktailsState, s => s.selected);

export const selectAlcoholicTotals = createSelector(selectAllCocktails, (list) => {
  const alcoholic     = list.filter(c => c.alcoholic === 'Alcoholic').length;
  const nonAlcoholic  = list.filter(c => c.alcoholic === 'Non_Alcoholic').length;
  return { alcoholic, nonAlcoholic };
});
