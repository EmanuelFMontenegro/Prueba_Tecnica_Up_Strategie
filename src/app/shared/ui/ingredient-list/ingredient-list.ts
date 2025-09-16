import { ChangeDetectionStrategy, Component, Inject, inject, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IngredientMeasure } from '@core/models/cocktail.model';
import { CocktailApi } from '@core/services/cocktail.api';
import { DialogHeaderComponent } from '../dialog/dialog-header';
import { LanguageService, type Lang } from '@core/services/language.service';

export interface IngredientListData {
  ingredients?: ReadonlyArray<IngredientMeasure>;
  items?: ReadonlyArray<IngredientMeasure>;
}

type MaybeWithImage = IngredientMeasure & { imageUrl?: string | null };

@Component({
  standalone: true,
  selector: 'app-ingredient-list',
  imports: [MatDialogModule, DialogHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog-header
      [title]="title()"
      [subtitle]="subtitle()"
    />

    <section class="dialog-body">
      <div class="ing-card">
        <ul class="ing-list" role="list">
          @for (i of rows; track i.ingredient) {
            <li class="ing-item">
              <img
                class="ing-img"
                [src]="getImg(i)"
                [alt]="i.ingredient"
                loading="lazy"
                decoding="async"
                (error)="hideImg($event)"/>
              <span class="ing-name">{{ i.ingredient }}</span>
              <span class="ing-measure">{{ i.measure ?? '—' }}</span>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class IngredientListComponent {
  private api = inject(CocktailApi);
  private langSvc = inject(LanguageService);

  readonly rows: ReadonlyArray<IngredientMeasure>;

  constructor(@Inject(MAT_DIALOG_DATA) data: IngredientListData) {
    this.rows = (data.ingredients ?? data.items ?? []) as ReadonlyArray<IngredientMeasure>;
  }


  readonly title = computed(() => (this.langSvc.lang() === 'es' ? 'Ingredientes' : 'Ingredients'));

  readonly subtitle = computed(() => {
    const l = this.langSvc.lang() as Lang;
    const n = this.rows.length;
    if (l === 'es') {
      return n === 1 ? '1 ingrediente' : `${n} ingredientes`;
    } else {
      return n === 1 ? '1 ingredient' : `${n} ingredients`;
    }
  });

  getImg(i: MaybeWithImage): string {
    return i.imageUrl ?? this.api.ingredientImage(i.ingredient, 'small');
  }

  hideImg(ev: Event) {
    (ev.target as HTMLImageElement).style.visibility = 'hidden';
  }
}
