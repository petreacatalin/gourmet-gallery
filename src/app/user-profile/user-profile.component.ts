import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profilePictureUrl: string = '';
  username: string = '';
  bio: string = '';
  location: string = '';
  savedRecipes: any[] = [];
  currentPassword: string = '';
  newPassword: string = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProfileData();
    this.loadSavedRecipes();
  }

  loadProfileData(): void {
    this.http.get<any>(`${environment.baseUrl}/profile`).subscribe(data => {
      this.profilePictureUrl = data.profilePictureUrl;
      this.username = data.username;
      this.bio = data.bio;
      this.location = data.location;
    });
  }

  loadSavedRecipes(): void {
    this.http.get<any[]>(`${environment.baseUrl}/saved-recipes`).subscribe(data => {
      this.savedRecipes = data;
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePicture(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http.post(`${environment.baseUrl}/upload-profile-picture`, formData).subscribe(response => {
        //this.profilePictureUrl = response['profilePictureUrl'];
      });
    }
  }

  changePassword(): void {
    const body = { currentPassword: this.currentPassword, newPassword: this.newPassword };
    this.http.post(`${environment.baseUrl}/change-password`, body).subscribe(response => {
      alert('Password changed successfully');
    }, error => {
      alert('Failed to change password');
    });
  }
}
