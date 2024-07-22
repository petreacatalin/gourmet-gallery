import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(public authService: AuthService, private router: Router) { }

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;

    // Optionally handle toggling classes or additional logic
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      if (this.isCollapsed) {
        appContainer.classList.add('collapsed');
        appContainer.classList.remove('expanded');
      } else {
        appContainer.classList.remove('collapsed');
        appContainer.classList.add('expanded');
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
