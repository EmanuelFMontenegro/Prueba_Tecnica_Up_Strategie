// state/cocktails/effects/cocktails.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CocktailsActions } from '../actions/cocktails.actions';
import { CocktailApi } from '@core/services/cocktail.api';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable()
export class CocktailsEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(CocktailApi);

  // --- ya existentes ---
  queryByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.queryByName),
      mergeMap(({ name }) =>
        this.api.searchByName(name).pipe(
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  queryByFirstLetter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.queryByFirstLetter),
      mergeMap(({ letter }) =>
        this.api.searchByFirstLetter(letter).pipe(
          map(list => CocktailsActions.loadSuccess({ list })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        )
      )
    )
  );

  loadById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CocktailsActions.loadById),
      mergeMap(({ id }) =>
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
      mergeMap(() =>
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
          switchMap(summaries => summaries.length
            ? forkJoin(summaries.map(s => this.api.lookupById(s.id)))
            : of([])),
          map(details => CocktailsActions.loadSuccess({ list: (details.filter(Boolean)) as any })),
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
          switchMap(summaries => summaries.length
            ? forkJoin(summaries.map(s => this.api.lookupById(s.id)))
            : of([])),
          map(details => CocktailsActions.loadSuccess({ list: (details.filter(Boolean)) as any })),
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
          
          switchMap(summaries => summaries.length
            ? forkJoin(summaries.map(s => this.api.lookupById(s.id)))
            : of([])),
          map(details => CocktailsActions.loadSuccess({ list: (details.filter(Boolean)) as any })),
          catchError((e: unknown) => of(CocktailsActions.error({ error: String(e) })))
        );
      })
    )
  );
}
