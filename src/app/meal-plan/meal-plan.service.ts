import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MealPlan } from '../models/mealPlan.interface';

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {

  constructor(private http: HttpClient) { }

 getMealPlans() {
    return this.http.get<any[]>(`${environment.baseUrl}/recipes`);
  }

  addMealPlan(mealPlan:MealPlan) {
    return this.http.post<any[]>(`${environment.baseUrl}/recipes`,{});
  }

}
