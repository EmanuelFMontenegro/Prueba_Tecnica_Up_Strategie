import { Component, effect, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CocktailsFacade } from '@state/cocktails/facade/cocktails.facade';
import { CommonModule } from '@angular/common';
import type { IngredientMeasure } from '@core/models/cocktail.model';
import { LanguageService, type Lang } from '@core/services/language.service';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.page.html',
})
export class DetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(CocktailsFacade);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);

  readonly cocktail = this.facade.selected;

  readonly lang = this.language.lang;

  readonly instructions = computed(() => {
    const c = this.cocktail();
    if (!c) return '—';
    const key = this.lang();
    return (
      (c.instructions && (c.instructions as any)[key]) ??
      c.instructions?.es ??
      c.instructions?.en ??
      '—'
    );
  });
  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.facade.loadById(id);
    });
  }
  setLang(l: Lang) {
    this.language.setLang(l);
  }
  byCategoryClick(c?: string | null) {
    if (c) this.router.navigate(['/list'], { queryParams: { category: c } });
  }
  goBack() {
    this.router.navigate(['/list']);
  }
}
