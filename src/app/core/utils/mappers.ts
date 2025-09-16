import {
  Cocktail,
  CocktailSummary,
  IngredientMeasure,
  AlcoholicKind,
} from '../models/cocktail.model';
import { DrinkDTO, INT_RANGE, IngredientKey, MeasureKey } from '../api/dto/cocktail-db.dto';

export type ImgSize = 'Small' | 'Medium' | 'Large';

export const ingredientImg = (name: string, size: ImgSize = 'Small') =>
  `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(name)}-${size}.png`;

export interface IngredientVM {
  name: string;
  measure: string | null;

  imageUrl?: string | null;
}

function extractIngredientsFromDTO(drink: DrinkDTO): IngredientMeasure[] {
  const list: IngredientMeasure[] = [];
  for (const i of INT_RANGE) {
    const ingKey = `strIngredient${i}` as IngredientKey;
    const meaKey = `strMeasure${i}` as MeasureKey;
    const ingredient = (drink[ingKey] ?? '').trim();
    const measure = (drink[meaKey] ?? null)?.trim?.() ?? null;
    if (!ingredient) continue;
    list.push({ ingredient, measure });
  }
  return list;
}

export function mapIngredientsVMFromCocktail(cocktail: Cocktail): IngredientVM[] {
  return cocktail.ingredients.map(({ ingredient, measure }) => ({
    name: ingredient,
    measure: measure?.trim?.() ?? null,
    imageUrl: ingredient ? ingredientImg(ingredient, 'Small') : null,
  }));
}

export function mapIngredientsVMFromDTO(drink: DrinkDTO): IngredientVM[] {
  return extractIngredientsFromDTO(drink).map(({ ingredient, measure }) => ({
    name: ingredient,
    measure,
    imageUrl: ingredient ? ingredientImg(ingredient, 'Small') : null,
  }));
}

const normalizeAlcoholic = (raw: string | null | undefined): AlcoholicKind => {
  const v = (raw ?? '').trim().toLowerCase();
  if (v === 'alcoholic') return 'Alcoholic';
  if (v === 'non_alcoholic' || v === 'non alcoholic' || v === 'non-alcoholic')
    return 'Non_Alcoholic';
  if (v === 'optional_alcohol' || v === 'optional alcohol' || v === 'optional-alcohol')
    return 'Optional_alcohol';
  return null;
};

const toLabel = (v: string | null | undefined) =>
  v ? v.replaceAll('_', ' ').replace(/\s+/g, ' ').trim() : null;

export function mapDrinkToCocktail(drink: DrinkDTO): Cocktail {
  const ingredients = extractIngredientsFromDTO(drink);

  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: toLabel(drink.strCategory),
    alcoholic: normalizeAlcoholic(drink.strAlcoholic),
    thumbUrl: drink.strDrinkThumb ?? null,
    dateModified: drink.dateModified ?? null,
    instructions: { en: drink.strInstructions ?? null, es: drink.strInstructionsES ?? null },
    ingredients,
  };
}

export function mapDrinkToSummary(
  drink: Pick<DrinkDTO, 'idDrink' | 'strDrink' | 'strDrinkThumb'>
): CocktailSummary {
  return { id: drink.idDrink, name: drink.strDrink, thumbUrl: drink.strDrinkThumb ?? null };
}
