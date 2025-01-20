import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../models/recipe.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NewsletterService } from '../main-page/newsletter/newsletter.service';
import { ToastService } from '../utils/toast/toast.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  pendingRecipes: Recipe[] = [];
  totalRecipes: number = 0;
  displayedColumns: string[] = ['id', 'title', 'status', 'actions'];
  dataSource = new MatTableDataSource<Recipe>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public recipeService: RecipeService,
     private newsletterService: NewsletterService,
     private toastrService: ToastService
  ) {}

  ngOnInit(): void {    
  }
    
  sendNewsletter(): void {
    this.newsletterService.triggerNewsletterManually().subscribe(() => {
         this.toastrService.showToast('You have successfully triggered newsletter!','success');
    },
  
    (error) => {
      this.toastrService.showToast('There was an error while subscribing to the newsletter.', 'error');
      console.error('Subscription error:', error);
    }
  );
  }

}
