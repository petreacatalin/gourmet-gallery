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
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ForgotPasswordComponent } from './auth/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/password/reset-password/reset-password.component';
import { ResetPasswordMessageComponent } from './auth/password/reset-password-message/reset-password-message.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent , data: { animation: 'login' }},
  { path: 'register', component: RegisterComponent , data: { animation: 'register' }},
  { path: 'mainpage', component: MainPageComponent , data: { animation: 'mainpage' }},
  { path: '', component: SidebarComponent },
  { path: 'recipes/list', component: RecipesListComponent , data: { animation: 'recipes/list' }},
  { path: 'recipes/create', component: RecipeAddEditComponent, data: { animation: 'recipes/create' } },
  { path: 'recipes/edit/:id', component: RecipeAddEditComponent , data: { animation: 'recipes/edit/:id' }},
  { path: 'recipes/:id', component: RecipeDetailComponent, data: { animation: 'recipes/:id' } },
  { path: 'user-profile', component: UserProfileComponent, data: { animation: 'user-profile' } },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: { animation: 'forgot-password' } },
  { path: 'reset-password', component: ResetPasswordComponent, data: { animation: 'reset-password' } },
  { path: 'reset-password-message', component: ResetPasswordMessageComponent, data: { animation: 'reset-password-message' } },
  { path: '', redirectTo: 'login', pathMatch: 'full', data: { animation: 'login' } },
  { path: '**', redirectTo: 'login', data: { animation: 'login' } }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule] 
})
export class AppRoutingModule { }
