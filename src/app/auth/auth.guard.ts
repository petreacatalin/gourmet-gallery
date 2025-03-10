import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    debugger;
    const isLoggedIn = this.authService.isLoggedIn();
    const requiredRoles = ['Admin', 'User']; // Required roles

    if (isLoggedIn) {
      // Check if the user has at least one of the required roles
      if (!this.authService.hasAnyRole(requiredRoles)) {
        this.router.navigate(['/forbidden']);
        return false; // User does not have the required role
      }
      return true; // User is authenticated and has at least one required role
    } else {
      this.router.navigate(['/login']);
      return false; // User is not authenticated
    }
  }
}
