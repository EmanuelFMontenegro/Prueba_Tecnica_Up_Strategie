
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cocktail, CocktailSummary, AlcoholicApiKind } from '../models/cocktail.model';
import { mapDrinkToCocktail, mapDrinkToSummary } from '../utils/mappers';
import { DrinksResp, DrinkDTO } from '../api/dto/cocktail-db.dto';

@Injectable({ providedIn: 'root' })
export class CocktailApi {
  private readonly http = inject(HttpClient);
  private readonly base = 'https://www.thecocktaildb.com/api/json/v1/1';

  searchByName(name: string): Observable<Cocktail[]> {
    const url = `${this.base}/search.php?s=${encodeURIComponent(name)}`;
    return this.http.get<DrinksResp>(url).pipe(map(r => (r.drinks ?? []).map(mapDrinkToCocktail)));
  }

  searchByFirstLetter(letter: string): Observable<Cocktail[]> {
    const url = `${this.base}/search.php?f=${encodeURIComponent(letter)}`;
    return this.http.get<DrinksResp>(url).pipe(map(r => (r.drinks ?? []).map(mapDrinkToCocktail)));
  }

  lookupById(id: string): Observable<Cocktail | null> {
    const url = `${this.base}/lookup.php?i=${encodeURIComponent(id)}`;
    return this.http.get<DrinksResp>(url).pipe(map(r => (r.drinks ?? []).map(mapDrinkToCocktail)[0] ?? null));
  }

  random(): Observable<Cocktail | null> {
    const url = `${this.base}/random.php`;
    return this.http.get<DrinksResp>(url).pipe(map(r => (r.drinks ?? []).map(mapDrinkToCocktail)[0] ?? null));
  }

  filterByIngredient(ingredient: string): Observable<CocktailSummary[]> {
    const url = `${this.base}/filter.php?i=${encodeURIComponent(ingredient)}`;
    return this.http
      .get<{ drinks: Pick<DrinkDTO,'idDrink'|'strDrink'|'strDrinkThumb'>[] | null }>(url)
      .pipe(map(r => (r.drinks ?? []).map(mapDrinkToSummary)));
  }


  filterByAlcoholic(flag: Extract<AlcoholicApiKind, 'Alcoholic' | 'Non_Alcoholic'>): Observable<CocktailSummary[]> {
    const url = `${this.base}/filter.php?a=${encodeURIComponent(flag)}`;
    return this.http
      .get<{ drinks: Pick<DrinkDTO,'idDrink'|'strDrink'|'strDrinkThumb'>[] | null }>(url)
      .pipe(map(r => (r.drinks ?? []).map(mapDrinkToSummary)));
  }

  filterByCategory(categoryApi: string): Observable<CocktailSummary[]> {
    const url = `${this.base}/filter.php?c=${encodeURIComponent(categoryApi)}`;
    return this.http
      .get<{ drinks: Pick<DrinkDTO,'idDrink'|'strDrink'|'strDrinkThumb'>[] | null }>(url)
      .pipe(map(r => (r.drinks ?? []).map(mapDrinkToSummary)));
  }

  filterByGlass(glassApi: string): Observable<CocktailSummary[]> {
    const url = `${this.base}/filter.php?g=${encodeURIComponent(glassApi)}`;
    return this.http
      .get<{ drinks: Pick<DrinkDTO,'idDrink'|'strDrink'|'strDrinkThumb'>[] | null }>(url)
      .pipe(map(r => (r.drinks ?? []).map(mapDrinkToSummary)));
  }


  listCategories()  { return this.http.get<{ drinks: Array<{ strCategory: string }> | null }>(`${this.base}/list.php?c=list`); }
  listGlasses()     { return this.http.get<{ drinks: Array<{ strGlass: string }> | null }>(`${this.base}/list.php?g=list`); }
  listIngredients() { return this.http.get<{ drinks: Array<{ strIngredient1: string }> | null }>(`${this.base}/list.php?i=list`); }
  listAlcoholic()   { return this.http.get<{ drinks: Array<{ strAlcoholic: AlcoholicApiKind }> | null }>(`${this.base}/list.php?a=list`); }


  drinkThumbVariant(url: string | null, size: 'small'|'medium'|'large'): string | null {
    return url ? `${url}/${size}` : null;
  }

  ingredientImage(name: string, size: 'small'|'medium'|'large'|'full' = 'small'): string {
    const baseName = encodeURIComponent(name.toLowerCase());
    if (size === 'full')   return `https://www.thecocktaildb.com/images/ingredients/${baseName}.png`;
    if (size === 'medium') return `https://www.thecocktaildb.com/images/ingredients/${baseName}-medium.png`;
    return `https://www.thecocktaildb.com/images/ingredients/${baseName}-small.png`;
  }
}
