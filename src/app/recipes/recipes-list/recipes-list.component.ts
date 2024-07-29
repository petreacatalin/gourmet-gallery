import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  displayedRecipes: Recipe[] = [];
  sortBy: string = 'title';
  filterText: string = '';
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.filterText = params['search'];
      }
      this.recipeService.getRecipes().pipe(
        tap(recipes => {
          console.log('Fetched recipes:', recipes);
          this.recipes = recipes;
          this.updateDisplayedRecipes();
        })
      ).subscribe();
    });
  }

  updateDisplayedRecipes(): void {
    if (!Array.isArray(this.recipes)) {
      console.error('Data is not an array:', this.recipes);
      return;
    }

    let filteredRecipes = this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(this.filterText.toLowerCase())
    );

    if (this.sortBy === 'title') {
      filteredRecipes.sort((a, b) => a.title.localeCompare(b.title));
    }

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
    this.currentPage = 1;
    this.updateDisplayedRecipes();
  }

  changeItemsPerPage(event: Event): void {
    this.itemsPerPage = +(event.target as HTMLSelectElement).value;
    this.applyFilter();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedRecipes();
    }
  }
}
