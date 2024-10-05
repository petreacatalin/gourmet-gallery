import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Recipe } from '../models/recipe.interface';
import { environment } from 'src/environments/environment';
import { Rating } from '../models/rating.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private baseUrl = `${environment.baseUrl}/recipes`;

  constructor(private http: HttpClient) { }

  getRecipes(isAdmin?: boolean): Observable<Recipe[]> {
    let params = new HttpParams();
    
    // Add isAdmin as a query parameter if it's defined
    if (isAdmin !== undefined) {
      params = params.set('isAdmin', isAdmin.toString());
    }
    
    return this.http.get<Recipe[]>(`${this.baseUrl}`, { params });
  }
  
  
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }
  
  getRecipeByIdAndSlug(id: number, slug: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}/${slug}`);
  }
  
  createRecipe(recipe:Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.baseUrl}`, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    const url = `${this.baseUrl}/${recipe.id}`; // Assuming id is present in Recipe interface
    return this.http.put<Recipe>(url, recipe);
  }

  getRatingsByRecipeId(id: number): Observable<Rating[]>{
    return this.http.get<Rating[]>(`${this.baseUrl}/ratings/${id}`);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getPopularRecipes(limit: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/popular?limit=${limit}`);
  }

  getLatestRecipes(limit: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/latest?limit=${limit}`);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData)
    return this.http.post<string>(`${environment.baseUrl}/upload/upload`, formData, {
      responseType: 'text' as 'json' 
    }); 
  }

  getPendingRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.baseUrl}/adminpanel/pending-recipes`);
  }

  approveRecipe(id: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/adminpanel/approve-recipe/${id}`, {});
  }

  rejectRecipe(id: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/adminpanel/reject-recipe/${id}`, {});
  }
}
