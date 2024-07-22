import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = []; // Array to hold all recipes
  displayedRecipes: Recipe[] = []; // Array to hold currently displayed recipes
  sortBy: string = 'title';
  filterText: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().pipe(
      tap(recipes => {
        this.recipes = recipes;
        this.updateDisplayedRecipes(); // Initialize displayed recipes
      })
    ).subscribe();
  }

  updateDisplayedRecipes(): void {
    // Ensure recipes is an array
    if (!Array.isArray(this.recipes)) {
      console.error('Data is not an array:', this.recipes);
      return;
    }

    // Filter recipes
    let filteredRecipes = this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(this.filterText.toLowerCase())
    );

    // Sort recipes
    if (this.sortBy === 'title') {
      filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'mealType') {
      filteredRecipes.sort((a, b) => (a.mealType || '').localeCompare(b.mealType || ''));
    }

    // Pagination
    this.totalPages = Math.ceil(filteredRecipes.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedRecipes = filteredRecipes.slice(startIndex, endIndex);
  }

  sortRecipes(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.updateDisplayedRecipes();
  }

  applyFilter(): void {
    this.currentPage = 1; // Reset to first page whenever filter is applied
    this.updateDisplayedRecipes();
  }

  changeItemsPerPage(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value;
    this.applyFilter(); // Reapply filter and sort to update displayed recipes
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedRecipes();
    }
  }
}
