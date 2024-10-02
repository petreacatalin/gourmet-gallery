import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../models/recipe.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(public recipeService: RecipeService) {}

  ngOnInit(): void {
    //this.loadRecipes();
  }

  // loadRecipes() {
  //   this.recipeService.getPendingRecipes().subscribe(recipes => {
  //     this.dataSource.data = recipes;
  //     this.totalRecipes = recipes.length;
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   });
  // }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // onPageChange(event: any) {
  //   // Handle pagination if needed
  //   this.loadRecipes(); // You might need to fetch the next page based on the event
  // }


  // deleteRecipe(id: number) {
  //   // Call your service to delete the recipe here
  //   console.log('Delete recipe with ID:', id);
  //   // Refresh the data after deletion
  //   this.loadRecipes();
  // }

  // editRecipe(id: number) {
  //   // Open a dialog to edit the recipe
  //   console.log('Edit recipe with ID:', id);
  // }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  
  // loadPendingRecipes() {
  //   this.recipeService.getPendingRecipes().subscribe(recipes => {
  //     this.pendingRecipes = recipes;
  //   });
  // }


}
