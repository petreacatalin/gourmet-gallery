import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.baseUrl}/recipes`;

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<{ $values: Recipe[] }>(`${this.baseUrl}`).pipe(
      map(response => response.$values) // Extract the recipes array from the $values property
    )};
  
    getRecipeById(id: number): Observable<Recipe> {
      return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
    }

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    const url = `${this.baseUrl}/${recipe.id}`; // Assuming id is present in Recipe interface
    return this.http.put<Recipe>(url, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
