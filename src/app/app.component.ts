// Example of role-based access control in AppComponent

import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationUser } from './models/applicationUser.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarCollapsed = false; // Control the state of sidebar collapse
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadUserDetails();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    
    return true; 
  }
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  logout() {
    this.authService.logout();
  }
}
