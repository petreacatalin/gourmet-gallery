import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { AuthService } from '../auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { Recipe } from 'src/app/models/recipe.interface';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';
import { MatTabGroup } from '@angular/material/tabs';

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
  userRecipes: any[] = [];
  @ViewChild('tabGroup') tabGroup: any; // Access to mat-tab-group
  @ViewChild('tabHeader', { read: ElementRef }) tabHeader: ElementRef | undefined; // Access to mat-tab-header

  selectedIndex = 0; // Track the currently selected tab
  chevrons: NodeListOf<HTMLElement> | undefined; // Store chevron elements

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
    setTimeout(() => {
      this.loadUserPublishedRecipes();
    }, 100);
  }

  
  ngAfterViewInit(): void {
    if (this.tabHeader) {
      // Locate chevron elements in the mat-tab-header
      this.chevrons = this.tabHeader.nativeElement.querySelectorAll(
        '.mat-tab-header-pagination-chevron'
      );

      if (this.chevrons!.length === 2) {
        this.chevrons![0].addEventListener('click', (event: MouseEvent) => this.handleChevronClick(event, 'left'));
        this.chevrons![1].addEventListener('click', (event: MouseEvent) => this.handleChevronClick(event, 'right'));

        this.chevrons!.forEach((chevron: HTMLElement) => {
          chevron.classList.add('mat-ripple');
          chevron.setAttribute('matRipple', '');
          chevron.setAttribute('matRippleColor', '#cccccc');
        });
      }
    }
  }

  // Handles chevron clicks and overrides their default behavior
  handleChevronClick(event: MouseEvent, direction: 'left' | 'right'): void {
    event.preventDefault(); // Prevent default scrolling behavior

    if (direction === 'left') {
      this.goToPreviousTab(); // Go to the previous tab
    } else if (direction === 'right') {
      this.goToNextTab(); // Go to the next tab
    }
  }

  // Navigate to the next tab
  goToNextTab(): void {
    if (this.tabGroup && this.selectedIndex < this.tabGroup._tabs.length - 1) {
      this.selectedIndex++;
      this.tabGroup.selectedIndex = this.selectedIndex;
    }
  }

  // Navigate to the previous tab
  goToPreviousTab(): void {
    if (this.tabGroup && this.selectedIndex > 0) {
      this.selectedIndex--;
      this.tabGroup.selectedIndex = this.selectedIndex;
    }
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
      this.authService.loadProfileData();
    }
  }

  loadSavedRecipes(): void {
    if (this.currentUser) {
      this.userProfileService.getFavorites(this.currentUser.id).subscribe(favorites => {
        this.favoriteRecipes = favorites;
      });
    }
  }

  loadUserPublishedRecipes(): void {
    if (this.currentUser) {
      this.userProfileService.getRecipesByLoggedUser().subscribe(userRecipes => {
        this.userRecipes = userRecipes
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
   
  navigateToRecipe(recipeId: number, slug: string) {
    this.router.navigate(['/recipes', recipeId, slug]); // Add slug to the navigation
  }
}
