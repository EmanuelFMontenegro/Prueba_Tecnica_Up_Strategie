
import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CocktailsActions } from '../actions/cocktails.actions';
import { Cocktail } from '@core/models/cocktail.model';

export const cocktailsFeatureKey = 'cocktails';

export interface FiltersState {
  kind: 'Alcoholic' | 'Non_Alcoholic' | null;
  category: string | null;
  ingredient: string | null;
}

export interface State extends EntityState<Cocktail> {
  loading: boolean;
  selected: Cocktail | null;
  error: string | null;
  filters: FiltersState;
}

const adapter = createEntityAdapter<Cocktail>({ selectId: (c) => c.id });

export const initialState: State = adapter.getInitialState({
  loading: false,
  selected: null,
  error: null,
  filters: { kind: null, category: null, ingredient: null },
});

const internalReducer = createReducer(
  initialState,


  on(CocktailsActions.queryByFirstLetter, CocktailsActions.queryByName, (state) => ({
    ...state, loading: true, error: null
  })),
  on(CocktailsActions.loadById, CocktailsActions.random, (state) => ({
    ...state, loading: true
  })),


  on(CocktailsActions.loadSuccess, (state, { list }) =>
    adapter.setAll([...list], { ...state, loading: false })
  ),
  on(CocktailsActions.loadOneSuccess, (state, { item }) => ({
    ...state, loading: false, selected: item ?? null
  })),
  on(CocktailsActions.clearSelection, (state) => ({ ...state, selected: null })),


  on(CocktailsActions.filterByAlcoholic, (state, { kind }) => ({
    ...state, filters: { ...state.filters, kind }
  })),
  on(CocktailsActions.filterByCategory, (state, { category }) => ({
    ...state, filters: { ...state.filters, category }
  })),
  on(CocktailsActions.filterByIngredient, (state, { ingredient }) => ({
    ...state, filters: { ...state.filters, ingredient }
  })),


  on(CocktailsActions.error, (state, { error }) => ({
    ...state, loading: false, error
  })),
  on(CocktailsActions.clearError, (state) => ({
    ...state, error: null
  })),
);

export function reducer(state: State | undefined, action: Action): State {
  return internalReducer(state, action);
}
