import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { CocktailsActions } from '../actions/cocktails.actions';
import { Cocktail } from '../../../core/models/cocktail.model';

export const cocktailsFeatureKey = 'cocktails';

export interface State extends EntityState<Cocktail> {
  loading: boolean;
  selected: Cocktail | null;
  error: string | null;
}

const adapter = createEntityAdapter<Cocktail>({ selectId: c => c.id });

export const initialState: State = adapter.getInitialState({
  loading: false,
  selected: null,
  error: null
});

const internalReducer = createReducer(
  initialState,

  on(CocktailsActions.queryByFirstLetter, CocktailsActions.queryByName, state => ({
    ...state, loading: true, error: null
  })),
  on(CocktailsActions.loadById, CocktailsActions.random, state => ({
    ...state, loading: true
  })),


  on(CocktailsActions.loadSuccess, (state, { list }) =>
  adapter.setAll([...list], { ...state, loading: false })
),


  on(CocktailsActions.loadOneSuccess, (state, { item }) => ({
    ...state, loading: false, selected: item ?? null
  })),

  on(CocktailsActions.clearSelection, state => ({
    ...state, selected: null
  })),


  on(CocktailsActions.error, (state, { error }) => ({
    ...state, loading: false, error
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return internalReducer(state, action);
}
