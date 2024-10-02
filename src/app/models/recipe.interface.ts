import { MealType, Cuisine, DietaryRestrictions, CookingMethod, MainIngredient, Occasion, DifficultyLevel } from "../utils/enums";
import { Comments } from "./comments.interface";
import { Ingredient } from "./ingredient.interface";
import { IngredientsTotal } from "./ingredientsTotal.interface";
import { Instructions } from "./instructions.interface";
import { Rating } from "./rating.interface";
import { Step } from "./step.interface";
import { ApplicationUser } from "./applicationUser.interface";
import { InformationTime } from "./informationTime.interface";
import { NutritionFacts } from "./nutritionFacts.interface";
import { Category } from "./category.interface";


export enum RecipeStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

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
  applicationUserId?: string;
  applicationUser: ApplicationUser;
  comments?: Comments[];
  ratings: Rating[];
  informationTime?: InformationTime;
  nutritionFacts?: NutritionFacts;
  averageRating: number;
  ratingsNumber: number;
  file?: any;
  createdAt: Date;       
  updatedAt?: Date;
  status: number;
  category?: Category[];
}

export function getStatusString(status: RecipeStatus): string {
  switch (status) {
      case RecipeStatus.Pending:
          return 'Pending';
      case RecipeStatus.Approved:
          return 'Approved';
      case RecipeStatus.Rejected:
          return 'Rejected';
      default:
          return 'Unknown';
  }
}