import { Component, HostListener, OnInit } from '@angular/core';
import { ApplicationUser } from '../models/applicationUser.interface';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../models/recipe.interface';
import { SpinnerService } from '../utils/spinner/spinner.service';
import { of, delay } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  currentUser:ApplicationUser | undefined;
  categories: Recipe[] = [];
  recipesToShow: number = 6; // Set the number of recipes to display
  limit: number = 15; // Set the desired limit
  popularRecipes$: Observable<Recipe[]> = new Observable<[]>;;
  latestRecipes$: Observable<Recipe[]> = new Observable<[]>;
  chunkSize = 3;
  isPopularLoading: boolean = false;
  isLatestLoading: boolean = false; 
  constructor(public authService: AuthService, 
    private recipeService: RecipeService,
    private spinnerService: SpinnerService,
    
  ){

  }


  ngOnInit(): void {
    this.updateChunkSize();
    this.loadLatestRecipes();
    this.loadPopularRecipes();

  }

  @HostListener('window:resize')
  onResize() { 
    this.updateChunkSize();
  }

  updateChunkSize() {
    this.chunkSize = window.innerWidth <= 768 ? 1 : 3; 
  }
  
  loadPopularRecipes(): void {
    this.isPopularLoading = true; // Start loading
    this.popularRecipes$ = this.recipeService.getPopularRecipes(this.limit); // Assign observable directly
    this.popularRecipes$.subscribe({
      next: () => {
        this.isPopularLoading = false; // End loading
      },
      error: () => {
        this.isPopularLoading = false; // Handle error and stop loading
      }
    });
  }

  loadLatestRecipes(): void {
    this.isLatestLoading = true; // Start loading
    this.latestRecipes$ = this.recipeService.getLatestRecipes(this.limit); // Assign observable directly
    this.latestRecipes$.subscribe({
      next: () => {
        this.isLatestLoading = false; // End loading
      },
      error: () => {
        this.isLatestLoading = false; // Handle error and stop loading
      }
    });
  }

  getStars(averageRating: number): number[] {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return [
      ...Array(fullStars).fill(1),    // Full stars
      ...Array(halfStar).fill(0.5),    // Half star
      ...Array(emptyStars).fill(0)     // Empty stars
    ];
  }
  
  chunkArray(array: any[], size: number): any[] {
    const results = [];
    while (array.length) {
      results.push(array.splice(0, size));
    }
    return results;
  }

}