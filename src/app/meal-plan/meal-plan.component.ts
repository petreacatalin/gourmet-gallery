import { Component, OnInit } from '@angular/core';
import { MealPlanService } from './meal-plan.service';
import { Recipe } from '../models/recipe.interface';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { MealPlan } from '../models/mealPlan.interface';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
})
export class MealPlanComponent implements OnInit {
  mealPlans: MealPlan[] = [];
  selectedDate: string | null = null;
  meal = { mealType: '', recipeId: 0 };
  recipes: Recipe[] = [];
  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin,timeGridPlugin,listPlugin],
    editable: true,
    selectable: true
  };

   calendarPlugins = [dayGridPlugin, timeGridPlugin];
  constructor(private mealPlanService: MealPlanService) {}

  ngOnInit(): void {
    this.loadMealPlans();
  }

  loadMealPlans(): void {
    this.mealPlanService.getMealPlans().subscribe((plans) => {
      this.mealPlans = plans.map((plan) => ({
        ...plan, // Spread the original properties
        title: `${plan.mealType}: ${plan.recipe.title}`, // Add a new `title` property
      }));
    });
  };

  handleDateClick(event: any): void {
    this.selectedDate = event.dateStr;
  }

  addMeal(): void {
    const newPlan = { ...this.meal, date: this.selectedDate };
    this.mealPlanService.addMealPlan(newPlan).subscribe(() => {
      this.loadMealPlans();
    });
  }
}
