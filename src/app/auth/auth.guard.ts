import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const requiredRole = 'Admin' as string; // Get required role from route data

    if (isLoggedIn) {
      // Optional: check for role
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        this.router.navigate(['/login']);
        return false; // User does not have the required role
      }
      return true; // User is authenticated and has the required role (if applicable)
    } else {
      this.router.navigate(['/login']);
      return false; // User is not authenticated
    }
  }
}
