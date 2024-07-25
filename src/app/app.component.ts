// Example of role-based access control in AppComponent

import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationUser } from './models/applicationUser.interface';
import { routeAnimations } from './animation-fade/animation';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative', width: '100%' }), // Ensure relative positioning
        group([
          // Animation for the new page (entering)
          query(':enter', [
            style({ position: 'absolute', width: '100%', transform: 'translateX(100%)', opacity: 0 }),
            animate('1000ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true }),
          // Animation for the old page (leaving)
          query(':leave', [
            style({ position: 'absolute', width: '100%', transform: 'translateX(0)', opacity: 1 }),
            animate('1000ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true })
        ])
      ])
    ])
  ]})

export class AppComponent {
  isSidebarCollapsed = false; // Control the state of sidebar collapse
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();

  constructor(private authService: AuthService, private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.authService.loadUserDetails();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  get isAdmin(): boolean {
    
    return true; 
  }
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
