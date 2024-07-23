import { Rating } from "./rating.interface";
import { ApplicationUser } from "./applicationUser.interface";
import { Recipe } from "./recipe.interface";

export interface Comments {
  id?: number; // Assuming id is optional or handled by the server
  content?: string;
  recipeId?: number; // Assuming recipeId is of type number
  timestamp?: Date; // Optional timestamp
  applicationUserId?: string; // Assuming userId is of type string
  user?: ApplicationUser; // Optional user info, adjust type as per your actual implementation
  rating?: Rating;
  }