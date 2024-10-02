import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.interface';
import { CategoryManagementService } from './category-management.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  mainCategories: Category[] = [];
  currentCategory: Category = { id: 0, name: '', description: '', slug: '', parentCategoryId: null };
  isEdit: boolean = false;
  displayedColumns: string[] = ['name', 'description', 'parent', 'actions'];
  expandedCategories: Set<number> = new Set(); // Track expanded categories

  constructor(private categoryService: CategoryManagementService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategoriesAsync().subscribe(categories => {
      this.categories = categories;
      this.mainCategories = categories.filter(cat => !cat.parentCategoryId); // Filter main categories
    });
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.categoryService.updateCategoryAsync(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    } else {
      this.categoryService.addCategoryAsync(this.currentCategory).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    }
  }

  editCategory(category: Category): void {
    this.currentCategory = { ...category };
    this.isEdit = true;
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategoryAsync(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  resetForm(): void {
    this.currentCategory = { id: 0, name: '', description: '', slug: '', parentCategoryId: null };
    this.isEdit = false;
  }

  toggleExpand(categoryId: number): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId); // Collapse
    } else {
      this.expandedCategories.add(categoryId); // Expand
    }
  }
  
  isExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId); // Check if expanded
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(cat => cat.parentCategoryId === parentId);
  }

  getCategoryNameById(id: number): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Unknown';
  }

  getIndentation(category: Category): number {
    let indentation = 0;
    let currentCategory = category;
  
    while (currentCategory.parentCategoryId !== null) {
      const parentCategory = this.categories.find(cat => cat.id === currentCategory.parentCategoryId);
      if (!parentCategory) {
        break;
      }
  
      currentCategory = parentCategory;
    }
  
    return indentation;
  }
  

  cancelEdit(): void {
    this.resetForm(); // Reset the form when canceling
  }
}
