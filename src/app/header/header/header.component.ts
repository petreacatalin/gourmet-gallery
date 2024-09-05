import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { SidebarService } from 'src/app/sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchText: string = '';
  currentUser: ApplicationUser | undefined;
  constructor(public authService: AuthService,
     private router: Router,
     private sidebarService:SidebarService
    ) { }

  ngOnInit(): void {
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.router.navigate(['/recipes/list'], { queryParams: { search: this.searchText } })
    }};
    
  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });
  }
  onLogout() {
    this.authService.logout();
    this.loadProfileData();
    this.router.navigate(['/mainpage']);
    if(this.sidebarService.isCollapsedSubject.value === false)
    {
      this.sidebarService.toggleSidebar();
    }
  }
}


