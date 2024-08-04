import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SidebarService } from '../sidebar/sidebar.service';
import { ApplicationUser } from '../models/applicationUser.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedIn?: boolean;
  isCollapsed: boolean = false;
  currentUser:ApplicationUser | undefined;

  constructor(
     public authService: AuthService,
     private router: Router, 
     private sidebarService: SidebarService) {
    this.loggedIn();
    this.loadProfileData();
      
     }

  ngOnInit(): void {
    this.loadProfileData();
    this.loggedIn();

    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isCollapsed = isCollapsed;
    });
  }

  
  
  loggedIn() {
    this.authService.loggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
    this.loggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/mainpage']);
  }
}
