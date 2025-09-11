import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { IngredientsListComponent, IngredientsListData } from '@shared/ui/ingredient-list/ingredient-list';
import { CocktailsFacade } from '@state/cocktails/facade/cocktails.facade';
import { CocktailApi } from '@core/services/cocktail.api';


type AlcoholicKind = 'Alcoholic' | 'Non_Alcoholic' | 'Optional_alcohol' | null;


type AlcoholicApiKind = Extract<NonNullable<AlcoholicKind>, 'Alcoholic' | 'Non_Alcoholic'>;

const kindLabel = (k: AlcoholicKind) =>
  k === 'Alcoholic'
    ? 'Alcoholic'
    : k === 'Non_Alcoholic'
    ? 'Non alcoholic'
    : k === 'Optional_alcohol'
    ? 'Optional alcohol'
    : '—';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatDialogModule],
  templateUrl: './list.page.html',
})
export class ListPage {
  private readonly facade = inject(CocktailsFacade);
  private readonly dialog = inject(MatDialog);
  private readonly api = inject(CocktailApi);

  readonly cocktails = this.facade.all;
  readonly loading = this.facade.loading;
  readonly totals = this.facade.totals;

  readonly name = signal<string>('');
  readonly firstLetter = signal<string>('a');


  readonly kinds: ReadonlyArray<{ value: '' | AlcoholicApiKind; label: string }> = [
    { value: '', label: 'Todos' },
    { value: 'Alcoholic', label: 'Alcoholic' },
    { value: 'Non_Alcoholic', label: 'Non alcoholic' },
  ];


  readonly categories = toSignal(
    this.api.listCategories().pipe(map((r) => (r.drinks ?? []).map((x) => x.strCategory))),
    { initialValue: [] as string[] }
  );


  onSearch() {
    const v = this.name().trim();
    if (v) this.facade.setName(v);
  }

  onPickLetter(l: string) {
    this.firstLetter.set(l);
    this.facade.setFirstLetter(l);
  }

 openIngredients(id: string): void {
  const item = this.cocktails().find(c => c.id === id);
  if (!item) return;

  const data: IngredientsListData = { ingredients: item.ingredients };
  this.dialog.open<IngredientsListComponent, IngredientsListData, void>(
    IngredientsListComponent,
    { data, autoFocus: false }
  );
}


  filterByCategory(c: string) {
    this.facade.filterByCategory(c);
  }

  filterByIngredient(i: string) {
    this.facade.filterByIngredient(i);
  }

  filterByType(kind: '' | 'Alcoholic' | 'Non_Alcoholic') {
    const value = kind === '' ? null : kind;
    this.facade.filterByType(value);
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value as '' | 'Alcoholic' | 'Non_Alcoholic';
    this.filterByType(value);
  }

  isAlcoholic(k: AlcoholicKind) {
    return k === 'Alcoholic';
  }
  isNonAlcoholic(k: AlcoholicKind) {
    return k === 'Non_Alcoholic';
  }
  kindLabel(k: AlcoholicKind) {
    return kindLabel(k);
  }
}
