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
  }

}
