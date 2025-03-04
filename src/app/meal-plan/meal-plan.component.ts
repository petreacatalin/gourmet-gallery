import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MealPlanService } from './meal-plan.service';
import { Recipe } from '../models/recipe.interface';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { MealPlan } from '../models/mealPlan.interface';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MealPlanComponent implements OnInit {
  mealPlans: MealPlan[] = [];
  selectedDate: string = ''; // Store as string in 'YYYY-MM-DD' format for consistency
  meal = { mealType: 0, recipeId: 0 };
  recipes: Recipe[] = [];
  selectedDayPlans: MealPlan[] = [];
  
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    editable: true,
    selectable: true,
    events: [],
    dateClick: this.handleDateClick.bind(this), // Properly bind method
  };

  constructor(
    private mealPlanService: MealPlanService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.loadMealPlans();
    this.loadRecipes();
  }

  mealTypeMap: { [key: string]: string } = {
    '1': 'Breakfast',
    '2': 'Lunch',
    '3': 'Dinner',
  };

  loadMealPlans(): void {
    this.mealPlanService.getMealPlans().subscribe((plans) => {
      this.mealPlans = plans.map((plan: MealPlan) => ({
        ...plan,
        date: plan.date ? new Date(plan.date) : new Date(), // Parse backend date string to Date object
        mealType: plan.mealType,
        mealTypeDisplay: this.mealTypeMap[plan.mealType] || 'Unknown Meal Type',
        recipe: plan.recipe,
      }));

      // Update calendar events
      this.calendarOptions.events = this.mealPlans.map((plan) => ({
        title: `${this.mealTypeMap[plan.mealType] || 'Meal'}: ${plan.recipe?.title || 'N/A'}`,
        date: plan.date.toISOString().split('T')[0],
        extendedProps: {
          recipeTitle: plan.recipe?.title || 'N/A',
          mealType: this.mealTypeMap[plan.mealType] || 'Unknown',
          recipe: plan.recipe,
        },
        backgroundColor: this.getMealColor(plan.mealType),
      }));
    });
  }

  removeMealPlan(mealPlanId: number): void {
    this.mealPlanService.deleteMealPlan(mealPlanId).subscribe(() => {
      this.loadMealPlans(); // Reload meal plans to refresh the calendar
      this.selectedDayPlans = this.selectedDayPlans.filter(
        (plan) => plan.id !== mealPlanId
      ); // Remove the plan from the selected day's list
    });
  }

  handleDateClick(event: any): void {
    this.selectedDate = event.dateStr; // `dateStr` is already in YYYY-MM-DD format

    // Ensure `plan.date` is always treated as a Date object for comparison
    this.selectedDayPlans = this.mealPlans.filter(
      (plan) => new Date(plan.date).toISOString().split('T')[0] === this.selectedDate
    );
  }




  /**
   * Load the list of available recipes for user selection.
   */
  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  addMeal(): void {
    const newPlan: MealPlan = {
      ...this.meal,
      date: new Date(this.selectedDate), // Convert the string date to a Date object
      recipeId: this.meal.recipeId,
      mealType: this.meal.mealType,
    };
  
    this.mealPlanService.addMealPlan(newPlan).subscribe(() => {
      this.loadMealPlans(); // Reload meal plans to refresh the calendar
    });
  }
  

  /**
   * Get a color associated with the meal type for calendar display.
   */
  getMealColor(mealType: string): string {
    switch (mealType) {
      case '1':
        return '#FFC107'; // Breakfast: Yellow
      case '2':
        return '#28A745'; // Lunch: Green
      case '3':
        return '#DC3545'; // Dinner: Red
      default:
        return '#6c757d'; // Default: Grey
    }
  }
}
