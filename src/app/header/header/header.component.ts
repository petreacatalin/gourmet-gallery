import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  menuOpen: boolean = false;
  isMenuVisible: boolean = false;
  screenWidth: number = window.innerWidth;
  constructor(
    public authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.router.navigate(['/recipes/list'], { queryParams: { search: this.searchText } });
    }
  }

  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogout() {
    this.authService.logout();
    this.loadProfileData();
    this.router.navigate(['/mainpage']);
    // if (this.sidebarService.isCollapsedSubject.value === false) {
    //   this.sidebarService.toggleSidebar();
    // }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Toggle the side menu
  }

  closeMenu() {
    this.menuOpen = false; // Close the side menu
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Close the menu if clicking outside of the menu and toggler button
    if (this.menuOpen && !target.closest('.side-menu') && !target.closest('.navbar-toggler')) {
      this.closeMenu();
    }
  }

  @HostListener('window:scroll', [])
  updateHeaderSize() {
    const header = document.querySelector('.sticky-header') as HTMLElement;
    if (window.scrollY > 50) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  }

  onMenuClick(event: MouseEvent) {
    // Prevent the menu from closing when clicking inside the menu
    event.stopPropagation();
  }
}
