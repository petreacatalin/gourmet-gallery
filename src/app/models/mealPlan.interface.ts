import { Recipe } from "./recipe.interface";

export interface MealPlan {
    id?: number;
    date: Date;
    mealType: any;
    recipeId: number;
    recipe?:Recipe;
    
}