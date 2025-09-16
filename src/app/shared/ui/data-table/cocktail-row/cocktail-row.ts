import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { CocktailApi } from '@core/services/cocktail.api';
import { Cocktail, CocktailSummary } from '@core/models/cocktail.model';



@Component({
  standalone: true,
  selector: 'tr[app-cocktail-row]',
  imports: [RouterLink, NgClass, NgOptimizedImage,MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cocktail-row.html',
})
export class CocktailRowComponent {
  @Input({ required: true }) c!: Cocktail;
  @Input({ required: true }) openIngredients!: (id: string) => void;
  @Input({ required: true }) allCocktails!: Cocktail[];
  private api = inject(CocktailApi);
  selectedCategory = '';
  categoryCocktails: CocktailSummary[] = [];

 isAlcoholic(k: Cocktail['alcoholic']) {
  return k === 'Alcoholic';
}

isNonAlcoholic(k: Cocktail['alcoholic']) {
  return k === 'Non_Alcoholic';
}

isOptionalAlcohol(k: Cocktail['alcoholic']) {
  return k === 'Optional_alcohol';
}
openCategory(category: string) {
  this.api.filterByCategory(category).subscribe({
    next: (cocktailsInCategory) => {
      if (!cocktailsInCategory.length) return;
      this.selectedCategory = category;
      this.categoryCocktails = cocktailsInCategory;
    },
    error: (err) => console.error(err)
  });
}

}






