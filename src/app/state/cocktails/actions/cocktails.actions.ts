
import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Cocktail } from '@core/models/cocktail.model';

export const CocktailsActions = createActionGroup({
  source: 'Cocktails',
  events: {
    'Query By First Letter': props<{ letter: string }>(),
    'Query By Name': props<{ name: string }>(),
    'Load By Id': props<{ id: string }>(),
    'Random': emptyProps(),

    'Filter By Category': props<{ category: string }>(),
    'Filter By Ingredient': props<{ ingredient: string }>(),

    'Filter By Alcoholic': props<{ kind: 'Alcoholic' | 'Non_Alcoholic' | null }>(),

    'Load Success': props<{ list: ReadonlyArray<Cocktail> }>(),
    'Load One Success': props<{ item: Cocktail | null }>(),
    'Clear Selection': emptyProps(),
    'Error': props<{ error: string }>(),
    'Clear Error': emptyProps(),

  },
});
