
export type AlcoholicApiKind = 'Alcoholic' | 'Non_Alcoholic' | 'Optional_alcohol';


export type AlcoholicKind = AlcoholicApiKind | null;

export interface IngredientMeasure {
  ingredient: string;
  measure: string | null;
  imageUrl?: string | null;
}

export interface Cocktail {
  id: string;
  name: string;
  category: string | null;
  alcoholic: AlcoholicKind;
  thumbUrl: string | null;
  dateModified: string | null;
  instructions?: { en?: string | null; es?: string | null };
  ingredients: IngredientMeasure[];
}

export type CocktailSummary = Pick<Cocktail, 'id' | 'name' | 'thumbUrl'>;


export const alcoholicLabel = (k: AlcoholicKind) =>
  k === 'Alcoholic' ? 'Alcoholic'
: k === 'Non_Alcoholic' ? 'Non alcoholic'
: k === 'Optional_alcohol' ? 'Optional alcohol'
: '—';
