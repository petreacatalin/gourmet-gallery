import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { AuthService } from '../auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { Recipe } from 'src/app/models/recipe.interface';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';

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
  newImageUrl: string | ArrayBuffer | null = null;

  constructor(
    private userProfileService: UserProfileService, 
    private authService: AuthService,
    private router:Router,
    private spinnerService: SpinnerService,
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
    this.spinnerService.hide();
    this.selectedFile = null;
    this.newImageUrl = null;
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.newImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    this.spinnerService.show();
    if (this.selectedFile) {
      this.userProfileService.uploadProfilePicture(this.selectedFile).subscribe(() => {
        this.loadProfileData(); // Reload profile to get new picture URL
      });
      this.selectedFile = null;
      this.newImageUrl = null;
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
    this.spinnerService.show();
    this.userProfileService.resetProfilePicture().subscribe(() => {
      this.loadProfileData(); // Reload profile to get default picture URL
    });
    this.spinnerService.hide();
  }

  removeSelectedfile(): void{
    this.selectedFile = null;
    this.newImageUrl = null;
  }
   
  navigateToRecipe(recipeId: number) {
    this.router.navigate(['/recipes', recipeId]);
  }
}
