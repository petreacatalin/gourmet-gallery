import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { AuthService } from '../auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { Recipe } from 'src/app/models/recipe.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profilePictureUrl: string = '';
  savedRecipes: any[] = [];
  selectedFile: File | null = null;
  currentUser: ApplicationUser | null | undefined;
  showModal = false;
  favoriteRecipes: Recipe[] = [];
  currentPassword: string = '';
  newPassword: string = '';

  constructor(
    private userProfileService: UserProfileService, 
    private authService: AuthService,
    private router:Router,
  ) {
    
   }

  ngOnInit(): void {
    this.loadProfileData();
    this.loadSavedRecipes();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
      this.loadSavedRecipes();
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePicture(): void {
    if (this.selectedFile) {
      this.userProfileService.uploadProfilePicture(this.selectedFile).subscribe(() => {
        this.loadProfileData(); // Reload profile to get new picture URL
      });
    }
  }

  loadSavedRecipes(): void {
    if (this.currentUser) {
      this.userProfileService.getFavorites(this.currentUser.id).subscribe(favorites => {
        this.favoriteRecipes = favorites;
      });
    }
  }

  addToFavorites(recipeId: number): void {
    if (this.currentUser) {
      this.userProfileService.addToFavorites(this.currentUser.id, recipeId).subscribe(() => {
        this.loadSavedRecipes();
      });
    }
  }

  removeFromFavorites(recipeId: number): void {
    if (this.currentUser) {
      this.userProfileService.removeFromFavorites(this.currentUser.id, recipeId).subscribe(() => {
        this.loadSavedRecipes();
      });
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  changePassword(): void {
    // Implement password change logic
  }

  resetProfilePicture(): void {
    this.userProfileService.resetProfilePicture().subscribe(() => {
      this.loadProfileData(); // Reload profile to get default picture URL
    });
  }
  navigateToRecipe(recipeId: number) {
    this.router.navigate(['/recipes', recipeId]);
  }
}
