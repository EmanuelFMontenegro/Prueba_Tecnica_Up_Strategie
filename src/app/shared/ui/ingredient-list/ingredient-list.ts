
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IngredientMeasure } from '@core/models/cocktail.model';
import { CommonModule } from '@angular/common';

export interface IngredientsListData {
  ingredients: ReadonlyArray<IngredientMeasure>;
}

@Component({
  selector: 'app-ingredients-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
  <section class="p-4">
    <h2 class="text-lg font-semibold mb-3">Ingredientes</h2>
    <div class="space-y-2">
      @for (i of data.ingredients; track i.ingredient) {
        <div class="flex items-center gap-3">
          @if (i.imageUrl) { <img [src]="i.imageUrl!" class="h-8 w-8 rounded" alt=""> }
          <div class="flex-1">{{ i.ingredient }}</div>
          <div class="text-gray-500">{{ i.measure ?? '—' }}</div>
        </div>
      }
    </div>
  </section>
  `
})
export class IngredientsListComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IngredientsListData) {}
}
