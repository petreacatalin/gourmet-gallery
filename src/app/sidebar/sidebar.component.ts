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
  currentUser?:ApplicationUser | undefined | null;

  constructor(
     public authService: AuthService,
     private router: Router, 
     private sidebarService: SidebarService) {
     }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isCollapsed = isCollapsed;
    });
   
    this.loggedIn();
  }

  
  
  loggedIn() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  
    this.authService.loggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {  
    this.authService.logout();
    this.currentUser = undefined;
    this.router.navigate(['/mainpage']);
  }
}
