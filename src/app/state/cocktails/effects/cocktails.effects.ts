
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CocktailsActions } from '../actions/cocktails.actions';
import { CocktailApi } from '@core/services/cocktail.api';
import {
  catchError, map, switchMap, debounceTime, distinctUntilChanged, withLatestFrom, timeout
} from 'rxjs/operators';
import { forkJoin, of, TimeoutError } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectFilters } from '../selectors/cocktails.selectors';
import { Cocktail } from '@core/models/cocktail.model';

type Filters = {
  kind: 'Alcoholic' | 'Non_Alcoholic' | null;
  category: string | null;
  ingredient: string | null;
};

function isCocktail(x: unknown): x is Cocktail {
  return !!x && typeof x === 'object' && 'id' in (x as Record<string, unknown>);
}

@Injectable()
export class CocktailsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(CocktailApi);
  private readonly store = inject(Store);

  private applyUiFilters(list: Cocktail[], f: Filters): Cocktail[] {
    const getKind = (c: Cocktail | Record<string, unknown>) =>
      (c as Cocktail).alcoholic ?? (c as Record<string, unknown>)['strAlcoholic'] ?? null;
    const getCat = (c: Cocktail | Record<string, unknown>) =>
      (c as Cocktail).category ?? (c as Record<string, unknown>)['strCategory'] ?? null;
    const getIngs = (c: Cocktail | Record<string, unknown>) => {
      const structured = (c as Cocktail).ingredients as unknown;
      if (Array.isArray(structured) && structured.length) {
        return structured
          .map(i => (typeof i === 'string' ? i : i?.name))
          .filter((s): s is string => typeof s === 'string' && !!s);
      }
      const out: string[] = [];
      const rec = c as Record<string, unknown>;
      for (let i = 1; i <= 15; i++) {
        const n = rec[`strIngredient${i}`];
        if (typeof n === 'string' && n) out.push(n);
      }
      return out;
    };

    return list
      .filter(x => !f.kind || getKind(x) === f.kind)
      .filter(x => !f.category || getCat(x) === f.category)
      .filter(x => !f.ingredient || getIngs(x).includes(f.ingredient));
  }


  queryByFirstLetter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.queryByFirstLetter),
      map(({ letter }) => letter.trim().toLowerCase()),
      distinctUntilChanged(),
      debounceTime(150),
      withLatestFrom(this.store.select(selectFilters)),
      switchMap(([letter, filters]) =>
        this.api.searchByFirstLetter(letter).pipe(
          timeout(5000),
          map(list => this.applyUiFilters(list, filters)),
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => {
            const msg = e instanceof TimeoutError
              ? 'La búsqueda por letra tardó demasiado. Intentalo de nuevo.'
              : String(e);
            return of(CocktailsActions.error({ error: msg }));
          })
        )
      )
    )
  );

  queryByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.queryByName),
      map(({ name }) => name.trim()),
      distinctUntilChanged(),
      debounceTime(250),
      withLatestFrom(this.store.select(selectFilters)),
      switchMap(([name, filters]) =>
        this.api.searchByName(name).pipe(
          timeout(5000),
          map(list => this.applyUiFilters(list, filters)),
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => {
            const msg = e instanceof TimeoutError
              ? 'La búsqueda por nombre tardó demasiado. Intentalo de nuevo.'
              : String(e);
            return of(CocktailsActions.error({ error: msg }));
          })
        )
      )
    )
  );


  loadById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.loadById),
      switchMap(({ id }) =>
        this.api.lookupById(id).pipe(
          map(item => CocktailsActions.loadOneSuccess({ item })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  random$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.random),
      switchMap(() =>
        this.api.random().pipe(
          map(item => CocktailsActions.loadOneSuccess({ item })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  filterByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.filterByCategory),
      switchMap(({ category }) =>
        this.api.filterByCategory(category).pipe(
          switchMap(summaries =>
            summaries.length ? forkJoin(summaries.map(s => this.api.lookupById(s.id))) : of([])),
          map(details => details.filter(isCocktail)),
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  filterByIngredient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.filterByIngredient),
      switchMap(({ ingredient }) =>
        this.api.filterByIngredient(ingredient).pipe(
          switchMap(summaries =>
            summaries.length ? forkJoin(summaries.map(s => this.api.lookupById(s.id))) : of([])),
          map(details => details.filter(isCocktail)),
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  filterByAlcoholic$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.filterByAlcoholic),
      switchMap(({ kind }) => {
        if (!kind) return of(CocktailsActions.loadSuccess({ list: [] }));
        return this.api.filterByAlcoholic(kind).pipe(
          switchMap(summaries =>
            summaries.length ? forkJoin(summaries.map(s => this.api.lookupById(s.id))) : of([])),
          map(details => details.filter(isCocktail)),
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        );
      })
    )
  );
}
