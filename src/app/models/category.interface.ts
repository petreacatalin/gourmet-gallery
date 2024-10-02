export interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    parentCategoryId?: number | null; // Optional field for parent category ID
    parentCategory?: Category; // Optional self-referencing for parent category
    subcategories?: Category[]; // Optional list of subcategories
    recipeCategories?: any[]; // Optional, assuming this represents a relation to RecipeCategory (could be more defined based on your needs)
  }