import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { tap } from 'rxjs/operators';
import { UserProfileService } from 'src/app/auth/user-profile/user-profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { ToastService } from 'src/app/utils/toast/toast.service';
import { Rating } from 'src/app/models/rating.interface';
import { Comments } from 'src/app/models/comments.interface';
import { SidebarService } from 'src/app/sidebar/sidebar.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {
  recipes: Recipe[] = [];
  displayedRecipes: Recipe[] = [];
  sortOption: string = 'title_asc'; // Default sort option
  filterText: string = '';
  itemsPerPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];
  favoriteRecipeIds: Set<number> = new Set<number>(); // Track favorite recipe IDs
  currentUser: any;
  ratings?: Rating[];
  isPulsing = false; // State for pulsating effect
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sorting order
  constructor(
    private recipeService: RecipeService,
     private route: ActivatedRoute,
     private userProfileService: UserProfileService,
     private authService: AuthService,
     private toastService: ToastService,
     private router: Router,
     private sidebarService: SidebarService
    
    ){
     }


     ngOnInit(): void {
      this.checkAndLoadProfileData();
  
      // Get query params and fetch recipes based on search filters
      this.route.queryParams.subscribe(params => {
        if (params['search']) {
          this.filterText = params['search'];
        }
        this.loadRecipes();
      });
    }

  checkAndLoadProfileData(): void {
    if (this.authService.isLoggedIn()) {
      this.loadProfileData();
    } else {
      this.loadRecipes();
    }
  }

  loadProfileData(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadFavorites(user.id);  
      },
      error: (error) => {
        console.error('Error loading profile data:', error);
      }
    });
  }

  loadFavorites(userId: string): void {
    this.userProfileService.getFavorites(userId).subscribe({
      next: (favorites) => {
        this.favoriteRecipeIds = new Set(favorites.map(recipe => recipe.id!));
        this.updateDisplayedRecipes();  // Update displayed recipes to reflect favorites
      },
      error: (err) => {
        console.log('Error fetching favorites:', err);
      }
    });
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().pipe(
      tap(recipes => {
        this.recipes = recipes;
        this.updateDisplayedRecipes();
      })
    ).subscribe({
      error: (err) => {
        console.log('Error fetching recipes:', err);
      }
    });
  }
  getStars(averageRating: number): number[] {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 > 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return [...Array(fullStars).fill(1), ...Array(halfStar).fill(0.5), ...Array(emptyStars).fill(0)];
  }
  
  triggerSuccess(recipeName?: string): void {
    this.toastService.showToast(`Successfully added ‘${recipeName}’ to your saved recipes!`, 'success');
  }
  
  triggerError(recipeName?: string): void {
    this.toastService.showToast(`‘${recipeName}’ has been removed from your saved recipes.`, 'error');
  }
  
  navigateToRecipe(recipeId: number, slug: string) {
    this.router.navigate(['/recipes', recipeId, slug]); // Add slug to the navigation
  }
  
  clearFilter(): void {
    this.filterText = '';
    this.applyFilter(); // Reset the filter after clearing
  }

  updateDisplayedRecipes(): void {
    if (!Array.isArray(this.recipes)) {
      console.error('Data is not an array:', this.recipes);
      return;
    }
  
    let filteredRecipes = this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(this.filterText.toLowerCase())
    );
  
    // Sort recipes based on the selected criteria
    filteredRecipes.sort((a, b) => {
      const [sortBy, order] = this.sortOption.split('_');
      
      let comparison = 0;
      
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'ratingsNumber') {
        comparison = a.ratingsNumber - b.ratingsNumber;
      } else if (sortBy === 'averageRating') {
        comparison = a.averageRating - b.averageRating;
      }
      else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return order === 'asc' ? comparison : -comparison; // Reverse order for descending
    });
  
    this.totalPages = Math.ceil(filteredRecipes.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedRecipes = filteredRecipes.slice(startIndex, endIndex);
  }
  
toggleSortOrder(): void {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  this.updateDisplayedRecipes(); // Reapply the sorting
}

  sortRecipes(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
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
