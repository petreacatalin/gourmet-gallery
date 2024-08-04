import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from 'src/app/models/recipe.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private http: HttpClient) { }

  uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${environment.baseUrl}/Account/profile-picture`, formData);
  }

  getSavedRecipes() {
    return this.http.get<any[]>(`${environment.baseUrl}/saved-recipes`);
  }

  addToFavorites(userId: string, recipeId: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/Account/add-favorite/${recipeId}`, {});
  }

  removeFromFavorites(userId: string, recipeId: number): Observable<void> {
    return this.http.post<void>(`${environment.baseUrl}/Account/remove-favorite/${recipeId}`, { userId });
  }

  getFavorites(userId: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.baseUrl}/Account/favorites`);
  }

  resetProfilePicture(): Observable<void> {
    return this.http.put<void>(`${environment.baseUrl}/Account/remove-profile-picture`, {});
  }
}