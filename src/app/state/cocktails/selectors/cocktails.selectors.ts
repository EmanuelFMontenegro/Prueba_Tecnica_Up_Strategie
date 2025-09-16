import { createFeatureSelector, createSelector } from '@ngrx/store';
import { cocktailsFeatureKey, State } from '../reducers/cocktails.reducer';

export const selectCocktailsState = createFeatureSelector<State>(cocktailsFeatureKey);

const selectIds = createSelector(selectCocktailsState, (s) => s.ids as ReadonlyArray<string>);
const selectEntities = createSelector(selectCocktailsState, (s) => s.entities);

export const selectFilters = createSelector(
  selectCocktailsState,
  (s) =>
    s.filters ?? {
      kind: null as 'Alcoholic' | 'Non_Alcoholic' | null,
      category: null as string | null,
      ingredient: null as string | null,
    }
);

export const selectAllCocktailsRaw = createSelector(selectIds, selectEntities, (ids, entities) =>
  ids.map((id) => entities[id]!).filter(Boolean)
);

export const selectAllCocktails = createSelector(selectAllCocktailsRaw, selectFilters, (items, f) =>
  items

    .filter((x) => {
      if (!f.kind) return true;
      const k = (x as any).alcoholic ?? (x as any).strAlcoholic ?? null;
      return k === f.kind;
    })

    .filter((x) => {
      if (!f.category) return true;
      const c = (x as any).category ?? (x as any).strCategory ?? null;
      return c === f.category;
    })

    .filter((x) => {
      if (!f.ingredient) return true;
      const ings = (x as any).ingredients ?? [];
      const names = Array.isArray(ings)
        ? ings.map((i: any) => (typeof i === 'string' ? i : i.name))
        : [];
      return names.includes(f.ingredient);
    })
);

export const selectCocktailsLoading = createSelector(selectCocktailsState, (s) => s.loading);
export const selectSelectedCocktail = createSelector(selectCocktailsState, (s) => s.selected);

export const selectCocktailsError = createSelector(selectCocktailsState, (s) => s.error);

export const selectAlcoholicTotals = createSelector(selectAllCocktails, (list) => {
  const getKind = (c: any) => c.alcoholic ?? c.strAlcoholic ?? null;
  const alcoholic = list.filter((c) => getKind(c) === 'Alcoholic').length;
  const nonAlcoholic = list.filter((c) => getKind(c) === 'Non_Alcoholic').length;
  return { alcoholic, nonAlcoholic };
});
