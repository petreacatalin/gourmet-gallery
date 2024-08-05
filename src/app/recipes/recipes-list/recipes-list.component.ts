import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { tap } from 'rxjs/operators';
import { UserProfileService } from 'src/app/auth/user-profile/user-profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { ToastService } from 'src/app/utils/toast/toast.service';

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
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  favoriteRecipeIds: Set<number> = new Set<number>(); // Track favorite recipe IDs
  currentUser: any;
  isPulsing = false; // State for pulsating effect
  constructor(
    private recipeService: RecipeService,
     private route: ActivatedRoute,
     private userProfileService: UserProfileService,
     private authService: AuthService,
     private toastService: ToastService,
     private router: Router
    
    ){
     }


  ngOnInit(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });

    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.filterText = params['search'];
      }
      this.recipeService.getRecipes().pipe(
        tap(recipes => {
          console.log('Fetched recipes:', recipes);
          this.recipes = recipes;
          console.log(recipes)
          this.updateDisplayedRecipes();
        })
      ).subscribe();
    });
   // Load favorite recipes for the current user
   this.authService.getProfile().subscribe(user => {
    if (user) {
      this.userProfileService.getFavorites(user.id).subscribe(favorites => {
        this.favoriteRecipeIds = new Set(favorites.map(recipe => recipe.id!));
        this.updateDisplayedRecipes();
      });
    }
  });
  }

  triggerSuccess(recipeName?: string): void {
    this.toastService.showToast(`Successfully added ‘${recipeName}’ to your saved recipes!`, 'success');
  }
  
  triggerError(recipeName?: string): void {
    this.toastService.showToast(`‘${recipeName}’ has been removed from your saved recipes.`, 'error');
  }
  
  navigateToRecipe(recipeId: number) {
    this.router.navigate(['/recipes', recipeId]);
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

  toggleFavorite(recipe: Recipe): void {
    const isFavorite = this.favoriteRecipeIds.has(recipe.id!);
    if (isFavorite) {
      this.triggerError(recipe.title);
      this.userProfileService.removeFromFavorites(this.currentUser.id, recipe.id!).subscribe(() => {
        this.favoriteRecipeIds.delete(recipe.id!);
        this.updateDisplayedRecipes();
      });
    } else {
      this.triggerSuccess(recipe.title);
      this.userProfileService.addToFavorites(this.currentUser.id, recipe.id!).subscribe(() => {
        this.favoriteRecipeIds.add(recipe.id!);
        this.updateDisplayedRecipes();
      });
    }
    setTimeout(() => {
      this.isPulsing = false; // Reset pulsing state after animation
    }, 500); // Duration of the pulse animation
  }

  isFavorite(recipeId: number): boolean {
    return this.favoriteRecipeIds.has(recipeId);
  }

}
