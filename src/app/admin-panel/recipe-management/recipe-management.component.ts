import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { Recipe , RecipeStatus, getStatusString} from 'src/app/models/recipe.interface';

@Component({
  selector: 'app-recipe-management',
  templateUrl: './recipe-management.component.html',
  styleUrls: ['./recipe-management.component.scss']
})
export class RecipeManagementComponent implements OnInit {
  @Input() isPending: boolean = false; // Flag to determine which recipes to display
  displayedColumns: string[] = ['id', 'title', 'status', 'actions'];
  dataSource = new MatTableDataSource<Recipe>();
  totalRecipes: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes() {
    if (this.isPending) {
      this.recipeService.getPendingRecipes().subscribe(recipes => {
        this.dataSource.data = recipes;
        this.totalRecipes = recipes.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.recipeService.getRecipes(true).subscribe(recipes => {
        this.dataSource.data = recipes;
        this.totalRecipes = recipes.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }
  
  handleApproveRecipe(id: number): void { // Renamed method
    if (confirm("Are you sure you want to approve this recipe?")) {
      this.recipeService.approveRecipe(id).subscribe(() => { // Call the service method
        this.loadRecipes(); // Refresh the data
      }, error => {
        console.error('Error approving recipe', error);
      });
    }
  }
  
  handleRejectRecipe(id: number): void { // Renamed method
    if (confirm("Are you sure you want to reject this recipe?")) {
      this.recipeService.rejectRecipe(id).subscribe(() => { // Call the service method
        this.loadRecipes(); // Refresh the data
      }, error => {
        console.error('Error rejecting recipe', error);
      });
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRecipe(id: number) {
    // Implement the edit logic (e.g., navigate to an edit page or open a dialog)
  }

  deleteRecipe(id: number) {
    this.recipeService.deleteRecipe(id).subscribe(() => {
      this.loadRecipes(); // Reload recipes after deletion
    });
  }

  getStatusString(status: RecipeStatus): string {
    return getStatusString(status);
  }
}
