import { Component, HostListener, OnInit } from '@angular/core';
import { ApplicationUser } from '../models/applicationUser.interface';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../models/recipe.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  currentUser:ApplicationUser | undefined;
  categories: Recipe[] = [];
  popularRecipes: Recipe[] = [];
  recipesToShow: number = 6; // Set the number of recipes to display
  limit: number = 15; // Set the desired limit
  latestRecipes: Recipe[] = [];
  chunkSize = 3;
  constructor(public authService: AuthService, private recipeService: RecipeService) {}


  ngOnInit(): void {
    this.updateChunkSize();
    this.fetchLatestRecipes();
    this.fetchPopularRecipes();
  }

  @HostListener('window:resize')
  onResize() { 
    this.updateChunkSize();
  }

  updateChunkSize() {
    this.chunkSize = window.innerWidth <= 768 ? 1 : 3; 
  }

  fetchLatestRecipes(): void {
    this.recipeService.getLatestRecipes(this.limit).subscribe((recipes) => {
      this.latestRecipes = recipes;
    }); 
  }

  fetchPopularRecipes() {
    this.recipeService.getPopularRecipes(this.limit).subscribe((recipes) => {
      this.popularRecipes = recipes;
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
  
  onSubscribe(){

  }
}