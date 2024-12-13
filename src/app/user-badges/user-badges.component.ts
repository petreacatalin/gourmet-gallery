// user-badges.component.ts
import { Component, OnInit } from '@angular/core';
import { UserBadgeService } from './user-badges.service';
import { Badge } from '../models/badge.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-badges',
  templateUrl: './user-badges.component.html',
  styleUrls: ['./user-badges.component.scss']
})
export class UserBadgesComponent implements OnInit {
  userBadges: Badge[] = [];
  badges: Badge[] = [];
  activeBadge: Badge | null = null;
  
  constructor(private badgeService: UserBadgeService) {}

  ngOnInit(): void {
   this.processUserBadges();
  //  this.fetchBadges();
  //  this.fetchUserBadges();
   this.combineBadges();
  }

  processUserBadges(){
    this.badgeService.processUserBadges().subscribe(() => { // Call the service method
      
    }, error => {
      console.error('Error approving recipe', error);
    });
  }

  fetchBadges(): void {
    this.badgeService.getBadges().subscribe((badges) => {
      this.badges = badges;
      console.log(this.badges)
    });
  }

  fetchUserBadges(): void {
    this.badgeService.getUserBadges().subscribe((badges) => {
      this.userBadges = badges;
      console.log(this.userBadges)

    });
   this.filterUserBadges();
    
  }

  filterUserBadges(): void {
    this.userBadges.forEach(badge => {
      const isUserBadge = this.userBadges.some(userBadge => userBadge.id === badge.id);

      // Add a 'earned' or 'unearned' property to the badge for styling purposes
      badge.isActive = isUserBadge;
    });
  }
  showBadgeDetails(badge: Badge): void {
    this.activeBadge = badge;
  }
  
    hideBadgeDetails(): void {
      this.activeBadge = null;
    }

    combineBadges(): void {
      this.badgeService.getBadges().subscribe((allBadges) => {
        this.badgeService.getUserBadges().subscribe((userEarnedBadges) => {
          // Map through all badges and check if they exist in the userEarnedBadges array
          const combinedBadges = allBadges.map((badge) => {
            const isEarned = userEarnedBadges.some(
              (userBadge) => 
                userBadge.name === badge.name || 
                userBadge.condition === badge.condition
            );
    
            return {
              ...badge,
              isActive: isEarned ? true : false,
            };
          });
    
          this.badges = combinedBadges; 
          console.log(this.badges);
        });
      });
    }
}
