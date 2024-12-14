import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfileService } from 'src/app/auth/user-profile/user-profile.service';
import { Recipe } from 'src/app/models/recipe.interface';
import { ToastService } from 'src/app/utils/toast/toast.service';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-social-action-buttons',
  templateUrl: './social-action-buttons.component.html',
  styleUrls: ['./social-action-buttons.component.scss']
})
export class SocialActionButtonsComponent implements OnInit {
  currentUrl?: string;
  frontEndUrl?: string = "https://gourmetgallery.azurewebsites.net";
  shareOptionsVisible: boolean = false;
  @Input() recipe?: Recipe;
  @Input() user?: any;
  @Output() rateClicked = new EventEmitter<void>();
  favoriteRecipeIds: Set<number> = new Set<number>(); // Track favorite recipe IDs

  constructor(
    private toastService: ToastService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.user) {
      this.loadFavorites(this.user.id);
    }
    this.currentUrl = this.frontEndUrl + this.router.url;
  }

  toggleShareOptions() {
    this.shareOptionsVisible = !this.shareOptionsVisible;
  }

  rateRecipe() {
    this.rateClicked.emit(); 
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const shareButton = document.querySelector('.share-button');
    const shareOptions = document.querySelector('.share-options');
    
    if (this.shareOptionsVisible && !shareButton?.contains(target) && !shareOptions?.contains(target)) {
      this.shareOptionsVisible = false;
    }
  }

  triggerSuccess(recipeName?: string): void {
    this.toastService.showToast(`Successfully added ‘${recipeName}’ to your saved recipes!`, 'success');
  }
  
  triggerError(recipeName?: string): void {
    this.toastService.showToast(`‘${recipeName}’ has been removed from your saved recipes.`, 'error');
  }

  loadFavorites(userId: string): void {
    this.userProfileService.getFavorites(userId).subscribe({
      next: (favorites) => {
        this.favoriteRecipeIds = new Set(favorites.map(recipe => recipe.id!));
      },
      error: (err) => {
        console.log('Error fetching favorites:', err);
      }
    });
  }

  toggleFavorite(recipe: Recipe): void {
    const isFavorite = this.favoriteRecipeIds.has(recipe.id!);
    if (isFavorite) {
      this.triggerError(recipe.title);
      this.userProfileService.removeFromFavorites(this.user.id, recipe.id!).subscribe(() => {
        this.favoriteRecipeIds.delete(recipe.id!);
      });
    } else {
      this.triggerSuccess(recipe.title);
      this.userProfileService.addToFavorites(this.user.id, recipe.id!).subscribe(() => {
        this.favoriteRecipeIds.add(recipe.id!);
      });
    }
  }

  isFavorite(recipeId: number): boolean {
    return this.favoriteRecipeIds.has(recipeId);
  }
}
