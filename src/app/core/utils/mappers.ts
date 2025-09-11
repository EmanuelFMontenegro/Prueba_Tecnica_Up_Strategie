
import { Cocktail, CocktailSummary, IngredientMeasure, AlcoholicKind, AlcoholicApiKind } from '../models/cocktail.model';
import { DrinkDTO, INT_RANGE, IngredientKey, MeasureKey } from '../api/dto/cocktail-db.dto';

const normalizeAlcoholic = (raw: string | null | undefined): AlcoholicKind => {
  if (raw === 'Alcoholic' || raw === 'Non_Alcoholic' || raw === 'Optional_alcohol') return raw;
  return null;
};


const toLabel = (v: string | null | undefined) => v ? v.replaceAll('_', ' ') : null;

export function mapDrinkToCocktail(drink: DrinkDTO): Cocktail {
  const ingredients: IngredientMeasure[] = [];
  for (const i of INT_RANGE) {
    const ingKey = `strIngredient${i}` as IngredientKey;
    const meaKey = `strMeasure${i}` as MeasureKey;
    const ing = drink[ingKey] ?? null;
    const mea = drink[meaKey] ?? null;
    if (ing) ingredients.push({ ingredient: ing, measure: mea });
  }
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: toLabel(drink.strCategory),
    alcoholic: normalizeAlcoholic(drink.strAlcoholic),
    thumbUrl: drink.strDrinkThumb ?? null,
    dateModified: drink.dateModified ?? null,
    instructions: { en: drink.strInstructions ?? null, es: drink.strInstructionsES ?? null },
    ingredients
  };
}

export function mapDrinkToSummary(
  drink: Pick<DrinkDTO, 'idDrink' | 'strDrink' | 'strDrinkThumb'>
): CocktailSummary {
  return { id: drink.idDrink, name: drink.strDrink, thumbUrl: drink.strDrinkThumb ?? null };
}
