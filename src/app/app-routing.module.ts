import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthGuard } from './auth/auth.guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipeAddEditComponent } from './recipes/recipe-add-edit/recipe-add-edit.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent , data: { animation: 'login' }},
  { path: 'register', component: RegisterComponent , data: { animation: 'register' }},
  { path: 'mainpage', component: MainPageComponent , data: { animation: 'mainpage' }},
  { path: '', component: SidebarComponent },
  { path: 'recipes/list', component: RecipesListComponent , data: { animation: 'recipes/list' }},
  { path: 'recipes/create', component: RecipeAddEditComponent, data: { animation: 'recipes/create' } },
  { path: 'recipes/edit/:id', component: RecipeAddEditComponent , data: { animation: 'recipes/edit/:id' }},
  { path: 'recipes/:id', component: RecipeDetailComponent, data: { animation: 'recipes/:id' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' , data: { animation: '' }},
  { path: '**', redirectTo: '/login' , data: { animation: '**' }}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
