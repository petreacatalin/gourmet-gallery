import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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
  
    if (route.snapshot.routeConfig?.path === 'mainpage') {
      return []; 
    }
  
    const routeURL: string = route.snapshot.url.map(segment => segment.path).join('/');
    const fullURL = url ? `${url}/${routeURL}` : routeURL;
  
    const breadcrumbLabel = route.snapshot.data['breadcrumb'];
  
    if (url.includes('recipes')) {
      if (route.snapshot.routeConfig?.path !== 'list') {
        breadcrumbs.push({
          label: 'Recipes List',
          url: '/recipes/list' // Link to the recipes list
        });
      }
    }
  
    if (route.snapshot.params['id'] && route.snapshot.routeConfig?.path === ':id') {
      breadcrumbs.push({
        label: route.snapshot.params['id'], // Use the ID as a label
        url: `/${url}` // Link to the current route's URL
      });
    } else if (breadcrumbLabel) {
      breadcrumbs.push({
        label: breadcrumbLabel,
        url: `/${fullURL}` // Link to the current route's URL
      });
    }
  
    if (breadcrumbs.length > 0) {
      breadcrumbs.unshift({
        label: 'Main Page',
        url: '/mainpage'
      });
    }
  
    return this.buildBreadcrumbs(route.firstChild!, fullURL, breadcrumbs);
  }
}  