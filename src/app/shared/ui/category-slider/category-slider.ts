
import { Component, Input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CocktailSummary } from '@core/models/cocktail.model';

@Component({
  standalone: true,
  selector: 'app-category-slider',
  imports: [CommonModule],
  templateUrl: './category-slider.html',
})
export class CategorySliderComponent {
  @Input() category!: string;
  @Input() cocktails: CocktailSummary[] = [];

  cocktailsList = signal<CocktailSummary[]>([]);


  private _effect = effect(() => {
    this.cocktailsList.set(this.cocktails);
  });

  goDetail = (id: string) => console.log('Ir al detalle del cocktail', id);

  get indices() {
    return Array.from({ length: this.cocktailsList().length }, (_, i) => i);
  }
}
