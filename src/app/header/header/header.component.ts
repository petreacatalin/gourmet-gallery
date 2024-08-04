import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchText: string = '';
  currentUser: ApplicationUser | undefined;
  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.router.navigate(['/recipes/list'], { queryParams: { search: this.searchText } })
    }};
    
  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });
  }
  onLogout() {
    this.authService.logout();
    this.loadProfileData();
    this.router.navigate(['/mainpage']);
  }
}


