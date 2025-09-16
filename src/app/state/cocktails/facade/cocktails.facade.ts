import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { CocktailsActions } from '../actions/cocktails.actions';
import {
  selectAllCocktails,
  selectCocktailsLoading,
  selectSelectedCocktail,
  selectAlcoholicTotals,
  selectCocktailsError,
} from '../selectors/cocktails.selectors';

interface CocktailQuery {
  firstLetter?: string | null;
  nameContains?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CocktailsFacade {
  private readonly store = inject(Store);

  readonly all = this.store.selectSignal(selectAllCocktails);
  readonly loading = this.store.selectSignal(selectCocktailsLoading);
  readonly selected = this.store.selectSignal(selectSelectedCocktail);
  readonly totals = this.store.selectSignal(selectAlcoholicTotals);
  readonly error = this.store.selectSignal(selectCocktailsError);

  readonly hasResults = computed(() => this.all().length > 0 && !this.loading());

  readonly query = signal<CocktailQuery>({ firstLetter: 'a', nameContains: null });

  private readonly _onQuery = effect(() => {
    const { firstLetter, nameContains } = this.query();

    const byLetter = firstLetter?.trim();
    const byName = nameContains?.trim();

    if (byLetter) {
      this.store.dispatch(CocktailsActions.queryByFirstLetter({ letter: byLetter }));
      return;
    }

    if (byName) {
      this.store.dispatch(CocktailsActions.queryByName({ name: byName }));
      return;
    }
  });

  setFirstLetter(letter: string | null) {
    const next = (letter ?? '').trim().toLowerCase() || null;
    const curr = (this.query().firstLetter ?? '').trim().toLowerCase() || null;
    if (curr === next) return;

    this.query.update((q) => ({
      ...q,
      firstLetter: next,

      nameContains: next ? null : q.nameContains,
    }));
  }

  clearFirstLetter() {
    if ((this.query().firstLetter ?? null) === null) return;
    this.query.update((q) => ({ ...q, firstLetter: null }));
  }

  setName(name: string) {
    const next = name.trim();
    const curr = (this.query().nameContains ?? '').trim();
    if (curr === next) return;

    this.query.update((q) => ({
      ...q,
      nameContains: next,
      firstLetter: null,
    }));
  }

  loadById(id: string) {
    this.store.dispatch(CocktailsActions.loadById({ id }));
  }
  random() {
    this.store.dispatch(CocktailsActions.random());
  }
  clearSelection() {
    this.store.dispatch(CocktailsActions.clearSelection());
  }

  filterByCategory(category: string) {
    this.store.dispatch(CocktailsActions.filterByCategory({ category }));
  }
  filterByIngredient(ingredient: string) {
    this.store.dispatch(CocktailsActions.filterByIngredient({ ingredient }));
  }
  filterByType(kind: 'Alcoholic' | 'Non_Alcoholic' | null) {
    this.store.dispatch(CocktailsActions.filterByAlcoholic({ kind }));
  }

  clearError() {
    this.store.dispatch(CocktailsActions.clearError());
  }
}
