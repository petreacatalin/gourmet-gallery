import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthGuard } from './auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipeAddEditComponent } from './recipes/recipe-add-edit/recipe-add-edit.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mainpage', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: '', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'recipes/list', component: RecipesListComponent },
  { path: 'recipes/create', component: RecipeAddEditComponent },
  { path: 'recipes/edit/:id', component: RecipeAddEditComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
