
import { Injectable, inject, signal, linkedSignal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { CocktailsActions } from '../actions/cocktails.actions';
import { selectAllCocktails, selectCocktailsLoading, selectSelectedCocktail, selectAlcoholicTotals } from '../selectors/cocktails.selectors';

interface CocktailQuery { firstLetter?: string; nameContains?: string; }

@Injectable({ providedIn: 'root' })
export class CocktailsFacade {
  private readonly store = inject(Store);

  readonly all      = this.store.selectSignal(selectAllCocktails);
  readonly loading  = this.store.selectSignal(selectCocktailsLoading);
  readonly selected = this.store.selectSignal(selectSelectedCocktail);
  readonly totals   = this.store.selectSignal(selectAlcoholicTotals);

  readonly hasResults = computed(() => this.all().length > 0 && !this.loading());

  readonly query = signal<CocktailQuery>({ firstLetter: 'a' });

  private readonly trigger = linkedSignal({
    source: this.query,
    computation: (q) => {
      const byLetter = q.firstLetter?.trim();
      const byName   = q.nameContains?.trim();
      if (byLetter) this.store.dispatch(CocktailsActions.queryByFirstLetter({ letter: byLetter }));
      else if (byName) this.store.dispatch(CocktailsActions.queryByName({ name: byName }));
      return q;
    }
  });

  setFirstLetter(letter: string) { this.query.set({ firstLetter: letter }); }
  setName(name: string)          { this.query.set({ nameContains: name }); }
  loadById(id: string)           { this.store.dispatch(CocktailsActions.loadById({ id })); }
  random()                       { this.store.dispatch(CocktailsActions.random()); }
  clearSelection()               { this.store.dispatch(CocktailsActions.clearSelection()); }

  filterByCategory(category: string)    { this.store.dispatch(CocktailsActions.filterByCategory({ category })); }
  filterByIngredient(ingredient: string){ this.store.dispatch(CocktailsActions.filterByIngredient({ ingredient })); }

  filterByType(kind: 'Alcoholic' | 'Non_Alcoholic' | null) {
    this.store.dispatch(CocktailsActions.filterByAlcoholic({ kind }));}
}
