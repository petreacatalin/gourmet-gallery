import { Component, OnInit } from '@angular/core';
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
  limit: number = 10; // Set the desired limit

  constructor(public authService: AuthService, private recipeService: RecipeService) {}


  ngOnInit(): void {
    this.fetchCategories();
    this.fetchPopularRecipes();
  }

  fetchCategories(): void {
    this.recipeService.getRecipes().subscribe(data => {
      this.categories = data;
    });
  }

  fetchPopularRecipes() {
    this.recipeService.getPopularRecipes(this.limit).subscribe((recipes) => {
      this.popularRecipes = recipes;
      console.log(recipes)
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