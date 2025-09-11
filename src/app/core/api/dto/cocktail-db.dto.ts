export const INT_RANGE = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] as const;
export type IntRange = typeof INT_RANGE[number];

export type IngredientKey = `strIngredient${IntRange}`;
export type MeasureKey    = `strMeasure${IntRange}`;


export type DrinkDTOBase = {
  idDrink: string;
  strDrink: string;
  strCategory: string | null;
  strAlcoholic: 'Alcoholic' | 'Non_Alcoholic' | 'Optional_alcohol' | null;
  strDrinkThumb: string | null;
  dateModified: string | null;
  strInstructions?: string | null;
  strInstructionsES?: string | null;
};


export type DrinkDTO =
  DrinkDTOBase
  & Partial<Record<IngredientKey, string | null>>
  & Partial<Record<MeasureKey, string | null>>;

export type DrinksResp = { drinks: DrinkDTO[] | null };
