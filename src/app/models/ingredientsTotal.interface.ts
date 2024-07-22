import { Ingredient } from "./ingredient.interface";

export interface IngredientsTotal {
    id: number;
    ingredients: Ingredient[];
    recipeId: number;
  }