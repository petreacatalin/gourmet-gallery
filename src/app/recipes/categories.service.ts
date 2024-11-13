import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl = `${environment.baseUrl}/category`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}`);
  }

  getSubcategories(categoryId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/${categoryId}/subcategories`);
  }
}
