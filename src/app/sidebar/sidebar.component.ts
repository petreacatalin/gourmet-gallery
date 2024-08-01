import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedIn?: boolean;
  isCollapsed: boolean = false;

  constructor(public authService: AuthService, private router: Router, private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.authService.loggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

    this.sidebarService.isCollapsed$.subscribe((isCollapsed: boolean) => {
      this.isCollapsed = isCollapsed;
    });
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/mainpage']);
  }
}
