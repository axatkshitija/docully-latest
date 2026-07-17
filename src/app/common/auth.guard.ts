import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if currentUser exists in localStorage
    const currentUserRaw = localStorage.getItem('currentUser');
    
    if (currentUserRaw) {
      try {
        const currentUser = JSON.parse(currentUserRaw);
        if (currentUser) {
          // User is logged in, allow access
          return true;
        }
      } catch (e) {
        // Invalid JSON, treat as no user
      }
    }

    // No valid user found, redirect to login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
