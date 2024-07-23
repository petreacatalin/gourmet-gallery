import { MealType, Cuisine, DietaryRestrictions, CookingMethod, MainIngredient, Occasion, DifficultyLevel, OtherCategories } from "../utils/enums";
import { Comments } from "./comments.interface";
import { Ingredient } from "./ingredient.interface";
import { IngredientsTotal } from "./ingredientsTotal.interface";
import { Instructions } from "./instructions.interface";
import { Rating } from "./rating.interface";
import { Step } from "./step.interface";
import { ApplicationUser } from "./applicationUser.interface";

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  ingredientsTotal: IngredientsTotal;
  instructions: Instructions;
  tags?: string;
  imageUrl?: string;
  mealType?: MealType;
  cuisine?: Cuisine;
  dietaryRestrictions?: DietaryRestrictions;
  cookingMethod?: CookingMethod;
  mainIngredient?: MainIngredient;
  occasion?: Occasion;
  difficultyLevel?: DifficultyLevel;
  otherCategories?: OtherCategories;
  applicationUserId?: string;
  applicationUser: ApplicationUser;
  comments?: Comments[];
  ratings: Rating[];
  //reviews?: Review[];
}
