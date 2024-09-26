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
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './auth/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/password/reset-password/reset-password.component';
import { ResetPasswordMessageComponent } from './auth/password/reset-password-message/reset-password-message.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login', animation: 'login' }},
  { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Register', animation: 'register' }},
  { path: 'mainpage', component: MainPageComponent, data: { breadcrumb: 'Main Page', animation: 'mainpage' }},
  { path: 'recipes', children: [
      { path: 'list', component: RecipesListComponent, data: { breadcrumb: 'Recipes', animation: 'list' }},
      { path: 'create', component: RecipeAddEditComponent, data: { breadcrumb: 'Create Recipe', animation: 'create' }},
      { path: 'edit/:id', component: RecipeAddEditComponent, data: { breadcrumb: 'Edit Recipe', animation: 'edit/:id' }},
      { path: ':id', component: RecipeDetailComponent, data: { breadcrumb: 'Recipe Details', animation: ':id' }},
    ],  
  },
  { path: 'user-profile', component: UserProfileComponent, data: { breadcrumb: 'User Profile', animation: 'user-profile' }, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { breadcrumb: 'Forgot Password', animation: 'forgot-password' }},
  { path: 'reset-password', component: ResetPasswordComponent, data: { breadcrumb: 'Reset Password', animation: 'reset-password' }},
  { path: 'reset-password-message', component: ResetPasswordMessageComponent, data: { breadcrumb: 'Reset Password Message', animation: 'reset-password-message' }},
  { path: '', redirectTo: 'mainpage', pathMatch: 'full', data: { breadcrumb:'mainpage', animation: 'mainpage' }},
  { path: '**', redirectTo: 'mainpage', data: { breadcrumb: 'mainpage', animation: 'mainpage' }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
