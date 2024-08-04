import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '../models/applicationUser.interface';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  currentUser:ApplicationUser | undefined;
  constructor(public authService: AuthService,) { }

  ngOnInit(): void {
    this.loadProfileData();
  }
  loadProfileData(): void {
    this.authService.getProfile().subscribe(user => {
      this.currentUser = user;
    });
  }
}
