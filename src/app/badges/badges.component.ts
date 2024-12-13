import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Badge } from '../models/badge.interface';
import { UserBadgeService } from '../user-badges/user-badges.service';
import { BadgesService } from './badges.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { getBadgeConditionDescription } from './badge.utils';


@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
  badges: Badge[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  badge: Badge | undefined; 
  badgeForm!: FormGroup;
  totalBadges: number = 0;
  badgesPerPage: number = 10;
  currentPage: number = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder,private badgesService: BadgesService) {}

  ngOnInit(): void {
    this.createBadgeForm();
    this.getBadges();
    this.processUserBadges();
  }
  getBadges(): void {
    this.badgesService.getBadges().subscribe((badges) => {
      this.badges = badges;
    });
  }

  // This method will be triggered when the page changes
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;  // MatPaginator uses 0-based index
    this.badgesPerPage = event.pageSize;
    this.getBadges();  // Fetch badges for the current page
  }

  processUserBadges(){
    this.badgesService.processUserBadges().subscribe(() => { // Call the service method
      
    }, error => {
      console.error('Error approving recipe', error);
    });
  }
  createBadgeForm(){
    this.badgeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      iconUrl: ['', [Validators.required, Validators.pattern('https?://.+')]], // Validate URL format
      points: [0, [Validators.required, Validators.min(1)]],
      condition: ['', [Validators.required]],
      isActive: [true]  // Default value set to true
    });
  }
  get formControls() {
    return this.badgeForm.controls;
  }

  deleteBadge(badgeId: number): void {
    if (confirm('Are you sure you want to delete this badge?')) {
      this.badgesService.deleteBadge(badgeId).subscribe(() => {
        this.badges = this.badges.filter((badge) => badge.id !== badgeId);
      });
    }
  }

    onSubmit(): void {
    if (this.badgeForm.invalid) {
      return;  // Do nothing if form is invalid
    }

    // Get the form values and create the badge
    const newBadge: Badge = this.badgeForm.value;

    this.badgesService.createBadge(newBadge).subscribe(
      (response) => {
        alert('Badge created successfully!');
        this.badgeForm.reset();  // Reset the form after successful creation
      },
      (error) => {
        console.error('Error creating badge:', error);
        alert('An error occurred while creating the badge.');
      }
    );
  }

  getConditionDescription(condition: any): string {
    return getBadgeConditionDescription(condition);
  }}
