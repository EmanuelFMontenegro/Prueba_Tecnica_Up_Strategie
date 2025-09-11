import { reducer } from './cocktails.reducer';
import { CocktailsActions } from '../actions/cocktails.actions';
import { Cocktail } from '../../../core/models/cocktail.model';
import type { Action } from '@ngrx/store';

describe('CocktailsReducer', () => {
  const mockCocktails: Cocktail[] = [
    {
      id: '1',
      name: 'Mojito',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      thumbUrl: 'mojito.jpg',
      dateModified: '2024-01-01',
      instructions: {
        en: 'Mix ingredients',
        es: 'Mezclar ingredientes',
      },
      ingredients: [
        {
          ingredient: 'White rum',
          measure: '2 oz',
          imageUrl: 'white-rum.jpg',
        },
        {
          ingredient: 'Lime juice',
          measure: '1 oz',
          imageUrl: null,
        },
      ],
    },
    {
      id: '2',
      name: 'Piña Colada',
      category: 'Cocktail',
      alcoholic: 'Alcoholic',
      thumbUrl: 'pina-colada.jpg',
      dateModified: '2024-01-01',
      instructions: {
        en: 'Blend ingredients',
        es: 'Licuar ingredientes',
      },
      ingredients: [
        {
          ingredient: 'White rum',
          measure: '3 oz',
          imageUrl: 'white-rum.jpg',
        },
        {
          ingredient: 'Coconut cream',
          measure: '3 tbsp',
          imageUrl: null,
        },
      ],
    },
  ];

  const mockCocktail: Cocktail = mockCocktails[0];

  const getInitialState = () => reducer(undefined, { type: '@@init' } as Action);

  describe('Initial State', () => {
    it('should return the initial state', () => {
      const result = reducer(undefined, { type: '@@init' } as Action);
      const initialState = getInitialState();

      expect(result).toEqual(initialState);
      expect(result.loading).toBe(false);
      expect(result.selected).toBeNull();
      expect(result.error).toBeNull();
      expect(result.entities).toEqual({});
      expect(result.ids).toEqual([]);
    });

    it('should return the previous state for unknown action', () => {
      const prev = reducer(undefined, { type: '@@init' } as Action);
      const unknown: Action = { type: 'Unknown' };
      const result = reducer(prev, unknown);

      expect(result).toBe(prev);
    });
  });

  describe('Loading Actions', () => {
    it('should handle queryByFirstLetter action', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.queryByFirstLetter({ letter: 'a' });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle queryByName action', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.queryByName({ name: 'mojito' });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle loadById action', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadById({ id: '1' });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle random action', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.random();
      const result = reducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('Success Actions', () => {
    it('should handle loadSuccess action', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadSuccess({ list: mockCocktails });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.entities['1']).toEqual(mockCocktails[0]);
      expect(result.entities['2']).toEqual(mockCocktails[1]);
      expect(result.ids).toEqual(['1', '2']);
    });

    it('should replace existing entities on loadSuccess', () => {
      const initialState = getInitialState();

      const firstLoad = CocktailsActions.loadSuccess({ list: [mockCocktails[0]] });
      const stateAfterFirstLoad = reducer(initialState, firstLoad);

      const secondLoad = CocktailsActions.loadSuccess({ list: [mockCocktails[1]] });
      const result = reducer(stateAfterFirstLoad, secondLoad);

      expect(result.loading).toBe(false);
      expect(result.entities['1']).toBeUndefined();
      expect(result.entities['2']).toEqual(mockCocktails[1]);
      expect(result.ids).toEqual(['2']);
    });

    it('should handle loadOneSuccess action with item', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadOneSuccess({ item: mockCocktail });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.selected).toEqual(mockCocktail);
    });

    it('should handle loadOneSuccess action with null item', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadOneSuccess({ item: null });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.selected).toBeNull();
    });

    it('should handle loadOneSuccess action when item is null', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadOneSuccess({ item: null });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.selected).toBeNull();
    });
  });

  describe('Clear Selection Action', () => {
    it('should handle clearSelection action', () => {
      const initialState = getInitialState();
      const stateWithSelection = {
        ...initialState,
        selected: mockCocktail,
      };

      const action = CocktailsActions.clearSelection();
      const result = reducer(stateWithSelection, action);

      expect(result.selected).toBeNull();
    });
  });

  describe('Error Actions', () => {
    it('should handle error action', () => {
      const initialState = getInitialState();
      const errorMessage = 'Failed to load cocktails';
      const loadingState = {
        ...initialState,
        loading: true,
      };

      const action = CocktailsActions.error({ error: errorMessage });
      const result = reducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should preserve existing data when error occurs', () => {
      const stateWithData = {
        ...getInitialState(),
        entities: { '1': mockCocktail },
        ids: ['1'],
        selected: mockCocktail,
        loading: true,
      };

      const action = CocktailsActions.error({ error: 'Network error' });
      const result = reducer(stateWithData, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Network error');
      expect(result.entities['1']).toEqual(mockCocktail);
      expect(result.selected).toEqual(mockCocktail);
    });
  });

  describe('State Transitions', () => {
    it('should clear error when starting new query', () => {
      const stateWithError = {
        ...getInitialState(),
        error: 'Previous error',
      };

      const action = CocktailsActions.queryByName({ name: 'mojito' });
      const result = reducer(stateWithError, action);

      expect(result.error).toBeNull();
      expect(result.loading).toBe(true);
    });

    it('should maintain loading state through multiple actions', () => {
      const initialState = getInitialState();
      let state = reducer(initialState, CocktailsActions.queryByName({ name: 'mojito' }));
      expect(state.loading).toBe(true);

      state = reducer(state, CocktailsActions.loadSuccess({ list: mockCocktails }));
      expect(state.loading).toBe(false);
    });

    it('should handle complex state transitions', () => {
      const initialState = getInitialState();

      let state = reducer(initialState, CocktailsActions.queryByName({ name: 'mojito' }));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = reducer(state, CocktailsActions.loadSuccess({ list: mockCocktails }));
      expect(state.loading).toBe(false);
      expect(state.entities['1']).toBeDefined();

      state = reducer(state, CocktailsActions.loadById({ id: '1' }));
      expect(state.loading).toBe(true);

      state = reducer(state, CocktailsActions.loadOneSuccess({ item: mockCocktail }));
      expect(state.loading).toBe(false);
      expect(state.selected).toEqual(mockCocktail);

      state = reducer(state, CocktailsActions.clearSelection());
      expect(state.selected).toBeNull();
    });
  });

  describe('Entity Adapter Integration', () => {
    it('should correctly use entity adapter for setAll operation', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadSuccess({ list: mockCocktails });
      const result = reducer(initialState, action);

      expect(result.ids.length).toBe(2);
      expect(result.ids).toContain('1');
      expect(result.ids).toContain('2');

      expect(Object.keys(result.entities)).toHaveLength(2);
    });

    it('should handle empty list correctly', () => {
      const initialState = getInitialState();
      const action = CocktailsActions.loadSuccess({ list: [] });
      const result = reducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.ids).toEqual([]);
      expect(result.entities).toEqual({});
    });
  });
});
