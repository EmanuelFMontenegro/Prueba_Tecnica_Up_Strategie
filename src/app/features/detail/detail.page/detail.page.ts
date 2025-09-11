
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CocktailsFacade } from '@state/cocktails/facade/cocktails.facade';
import { CommonModule } from '@angular/common';

type Lang = 'es' | 'en';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.page.html',
})
export class DetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(CocktailsFacade);

  readonly cocktail = this.facade.selected;
  readonly lang = signal<Lang>('es');

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) this.facade.loadById(id);
    });
  }

  setLang(l: Lang) { this.lang.set(l); }
  byCategoryClick(c?: string | null) { if (c) this.facade.filterByCategory(c); }
}
