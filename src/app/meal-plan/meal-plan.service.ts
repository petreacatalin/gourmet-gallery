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
    return this.http.get<any[]>(`${environment.baseUrl}/mealplan/mealplans`);
  }

  addMealPlan(mealPlan:MealPlan) {
    return this.http.post<any[]>(`${environment.baseUrl}/mealplan/add-mealplan`,mealPlan);
  }
  deleteMealPlan(mealPlanId:number) {
    return this.http.delete<any[]>(`${environment.baseUrl}/mealplan/${mealPlanId}`);
  }
}
