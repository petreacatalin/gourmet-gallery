export interface Comments {
  id?: number; // Assuming id is optional or handled by the server
  content?: string;
  recipeId?: number; // Assuming recipeId is of type number
  timestamp?: Date; // Optional timestamp
  userId?: string; // Assuming userId is of type string
  user?: any; // Optional user info, adjust type as per your actual implementation
  }