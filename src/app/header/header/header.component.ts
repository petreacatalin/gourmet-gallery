import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchText: string = '';

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSearch() {
    if (this.searchText.trim()) {
      this.router.navigate(['/recipes/list'], { queryParams: { search: this.searchText } })
    }};
    

  onLogout() {
    this.authService.logout();
  }
}


