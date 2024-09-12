import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicationUser } from './models/applicationUser.interface';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { SidebarService } from './sidebar/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative', width: '100%' }), // Ensure relative positioning
        group([
          query(':enter', [
            style({ position: 'absolute', width: '100%', transform: 'translateX(100%)', opacity: 0 }),
            animate('800ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ], { optional: true }),
          query(':leave', [
            style({ position: 'absolute', width: '100%', transform: 'translateX(0)', opacity: 1 }),
            animate('800ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
          ], { optional: true })
        ]),
        query(':enter, :leave', style({ position: 'relative', width: '100%' }), { optional: true })
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();
  isSidebarVisible: boolean = false; // Controls if sidebar is visible (for mobile)
  isSidebarCollapsed: boolean = false; // Controls sidebar collapse/expand on all devices
  isMobile: boolean = window.innerWidth < 768; // To check if the screen is mobile-sized

  constructor(private authService: AuthService, private sidebarService: SidebarService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loadUserDetails();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isSidebarCollapsed = isCollapsed;
    });

    // Scroll to top on route change
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  get isAdmin(): boolean {
    return true; 
  }

  // Detect screen resize to update the mobile flag
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobile = event.target.innerWidth < 768;
  }
  
  // toggleSidebar() {
    //   this.isSidebarCollapsed = !this.isSidebarCollapsed;
    // }
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Toggle collapsed state on all devices
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  logout() {
    this.authService.logout();
  }
}
