import { Component, OnInit } from '@angular/core';
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
  isSidebarCollapsed = false; 
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();

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
