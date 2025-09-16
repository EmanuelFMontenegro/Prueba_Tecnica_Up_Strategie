import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

import { IngredientListComponent } from '@shared/ui/ingredient-list/ingredient-list';
import type { IngredientListData } from '@shared/ui/ingredient-list/ingredient-list';
import { AppDialogService } from '@app/shared/ui/dialog/dialog.service';



import { CocktailsFacade } from '@state/cocktails/facade/cocktails.facade';
import { CocktailApi } from '@core/services/cocktail.api';
import { Cocktail } from '@core/models/cocktail.model';
import { CocktailRowComponent } from '@shared/ui/data-table/cocktail-row/cocktail-row';

type AlcoholicKind = 'Alcoholic' | 'Non_Alcoholic' | 'Optional_alcohol' | null;
type AlcoholicApiKind = Extract<NonNullable<AlcoholicKind>, 'Alcoholic' | 'Non_Alcoholic'>;
type LoadSource = 'letter'|'name'|'category'|'ingredient'|'type'|null;

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,MatDialogModule, MatSnackBarModule, MatExpansionModule,MatFormFieldModule, MatSelectModule, MatIconModule,CocktailRowComponent
  ],
  templateUrl: './list.page.html',
})
export class ListPage {
  private readonly facade = inject(CocktailsFacade);
  private readonly dialog  = inject(MatDialog);
  private readonly api     = inject(CocktailApi);
  private readonly snack   = inject(MatSnackBar);
  private readonly dlg     = inject(AppDialogService);

  readonly cocktails = this.facade.all;
  readonly loading   = this.facade.loading;
  readonly totals    = this.facade.totals;

 
  readonly name        = signal<string>('');
  readonly firstLetter = signal<string | null>(null);


    readonly letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


  pageIndex = signal(0);
  pageSize  = signal(5);
  pageSizes = [5, 10, 15];


  private readonly lastSource = signal<LoadSource>(null);


  total     = computed(() => this.cocktails().length);
  pageCount = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  pagedCocktails = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.cocktails().slice(start, start + this.pageSize());
  });


  private readonly lastNonEmpty = signal<ReadonlyArray<Cocktail>>([]);
  private readonly _snapshotFx = effect(() => {
    if (!this.loading() && this.cocktails().length) this.lastNonEmpty.set(this.cocktails());
  });
  readonly visibleRows = computed(() => {
    const size = this.pageSize();
    const start = this.pageIndex() * size;
    const base = (this.loading() && this.lastNonEmpty().length) ? this.lastNonEmpty() : this.cocktails();
    return base.slice(start, start + size);
  });


  tableMask = signal(false);
  private readonly _tableMaskFx = effect((onCleanup) => {
    const isLoading = this.loading();
    let showT: ReturnType<typeof setTimeout> | null = null;
    let hideT: ReturnType<typeof setTimeout> | null = null;

    if (isLoading) {
      showT = setTimeout(() => this.tableMask.set(true), 180);
    } else {
      if (this.tableMask()) hideT = setTimeout(() => this.tableMask.set(false), 240);
      else this.tableMask.set(false);
    }
    onCleanup(() => { if (showT) clearTimeout(showT); if (hideT) clearTimeout(hideT); });
  });


  private readonly _resetOnData = effect(() => {
    this.cocktails();
    this.pageIndex.set(0);
  });


  private readonly _fallbackIfEmpty = effect(() => {
    if (this.loading() || this.lastSource() !== 'letter') return;
    if (this.cocktails().length === 0) {
      const tried = this.firstLetter() ?? '—';
      this.snack.open(`No encontramos cócteles con la letra "${tried}". Volvemos a la A.`, 'OK', { duration: 2500 });
      this.firstLetter.set('A');
      this.facade.setFirstLetter('a');
      this.lastSource.set(null);
      this.pageIndex.set(0);
    }
  });


  setPage(i: number) {
    const last = this.pageCount() - 1;
    this.pageIndex.set(Math.min(Math.max(0, i), last));
  }
  setPageSize(size: number) {
    this.pageSize.set(size);
    this.pageIndex.set(0);
  }

  readonly kinds: ReadonlyArray<{ value: '' | AlcoholicApiKind; label: string }> = [
    { value: '',              label: 'Todos' },
    { value: 'Alcoholic',     label: 'Alcoholic' },
    { value: 'Non_Alcoholic', label: 'Non alcoholic' },
  ];

  readonly categories = toSignal(
    this.api.listCategories().pipe(map(r => (r.drinks ?? []).map(x => x.strCategory))),
    { initialValue: [] as string[] }
  );

  onSearch() {
    const v = this.name().trim();
    if (v) {
      this.lastSource.set('name');
      this.facade.setName(v);
      this.pageIndex.set(0);
    }
  }

  onPickLetter(l: string | null) {
    this.firstLetter.set(l);
    this.lastSource.set('letter');
    if (l) this.facade.setFirstLetter(l);
    else   this.facade.clearFirstLetter();
    this.pageIndex.set(0);
  }

  filterByCategory(c: string) {
    this.lastSource.set('category');
    this.facade.filterByCategory(c);
    this.pageIndex.set(0);
  }

  filterByIngredient(i: string) {
    this.lastSource.set('ingredient');
    this.facade.filterByIngredient(i);
    this.pageIndex.set(0);
  }

  filterByType(kind: '' | 'Alcoholic' | 'Non_Alcoholic') {
    this.lastSource.set('type');
    const value = kind === '' ? null : kind;
    this.facade.filterByType(value);
    this.pageIndex.set(0);
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value as '' | 'Alcoholic' | 'Non_Alcoholic';
    this.filterByType(value);
  }

  openIngredients = async (id: string): Promise<void> => {
    const item = this.cocktails().find(c => c.id === id);
    if (!item) return;

    const { IngredientListComponent } = await import('@shared/ui/ingredient-list/ingredient-list');
    this.dlg.open(IngredientListComponent, { items: item.ingredients }, 'sm');
  };

  isAlcoholic(k: AlcoholicKind)    { return k === 'Alcoholic'; }
  isNonAlcoholic(k: AlcoholicKind) { return k === 'Non_Alcoholic'; }
  kindLabel(k: AlcoholicKind) {
    return k === 'Alcoholic' ? 'Alcoholic'
         : k === 'Non_Alcoholic' ? 'Non alcoholic'
         : k === 'Optional_alcohol' ? 'Optional alcohol'
         : '—';
  }
}
