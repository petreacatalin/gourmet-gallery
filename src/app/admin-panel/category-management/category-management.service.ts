import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementService {
  
  private baseUrl = `${environment.baseUrl}/category`;
  constructor(private http: HttpClient) {}

  getAllCategoriesAsync(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getCategoryByIdAsync(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  addCategoryAsync(category: Category): Observable<void> {
    return this.http.post<void>(this.baseUrl, category);
  }

  updateCategoryAsync(category: Category): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${category.id}`, category);
  }

  deleteCategoryAsync(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
