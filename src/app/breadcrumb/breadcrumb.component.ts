import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Recipe } from '../models/recipe.interface';
import { RecipeService } from '../recipes/recipe.service';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})

export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  recipeTitle: string | undefined; // Store the recipe title

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private recipeService: RecipeService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    if (!route) {
      return breadcrumbs;
    }

    // Skip breadcrumb for 'mainpage'
    if (route.snapshot.routeConfig?.path === 'mainpage') {
      return []; 
    }

    const routeURL: string = route.snapshot.url.map(segment => segment.path).join('/');
    const fullURL = url ? `${url}/${routeURL}` : routeURL;

    const breadcrumbLabel = route.snapshot.data['breadcrumb'];

    // Add Recipes breadcrumb
    if (url.includes('recipes')) {
      if (route.snapshot.routeConfig?.path !== 'list') {
        breadcrumbs.push({
          label: 'Recipes',
          url: '/recipes/list' // Link to the recipes list
        });
      }
    }

    // Handle recipe detail route with ID and slug
    if (route.snapshot.params['id'] && route.snapshot.routeConfig?.path === ':id/:slug') {
      const recipeId = route.snapshot.params['id'];
      this.recipeService.getRecipeById(recipeId).subscribe((recipe: Recipe) => {
        this.recipeTitle = recipe.title; // Set the recipe title from the service

        // Add recipe title to breadcrumbs after fetching
        breadcrumbs.push({
          label: this.recipeTitle!, // Use the recipe title as the label
          url: `/${url}` // Link to the current route's URL
        });
      });
    } else if (breadcrumbLabel) {
      breadcrumbs.push({
        label: breadcrumbLabel,
        url: `/${fullURL}` // Link to the current route's URL
      });
    }

    // Add Main Page breadcrumb
    if (breadcrumbs.length > 0) {
      breadcrumbs.unshift({
        label: 'Main Page',
        url: '/mainpage'
      });
    }

    // Recursively call for child routes
    return this.buildBreadcrumbs(route.firstChild!, fullURL, breadcrumbs);
  }
}
