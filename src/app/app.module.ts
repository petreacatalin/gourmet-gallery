import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './main-page/main-page.component';
import { FooterComponent } from './footer/footer.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipeAddEditComponent } from './recipes/recipe-add-edit/recipe-add-edit.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CommentsComponent } from './comments/comments/comments.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { JwtModule } from "@auth0/angular-jwt";
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './header/header/header.component';
import {MatStepperModule} from '@angular/material/stepper';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './auth/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/password/reset-password/reset-password.component';
import { ResetPasswordMessageComponent } from './auth/password/reset-password-message/reset-password-message.component';
import { SpinnerComponent } from './utils/spinner/spinner.component';
import {  MatTabsModule} from '@angular/material/tabs';
import { ToastComponent } from './utils/toast/toast.component';
import { ConfirmDialogComponent } from './recipes/confirm-dialog/confirm-dialog.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ChunkPipe } from './chunk.pipe';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RecipeManagementComponent } from './admin-panel/recipe-management/recipe-management.component';
import { CategoryManagementComponent } from './admin-panel/category-management/category-management.component';
import { MatTreeModule } from '@angular/material/tree';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent,
    FooterComponent,
    LogoutComponent,
    SidebarComponent,
    RecipeDetailComponent,
    RecipesListComponent,
    RecipeAddEditComponent,
    CommentsComponent,
    HeaderComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ResetPasswordMessageComponent,
    SpinnerComponent,
    ToastComponent,
    ConfirmDialogComponent,
    BreadcrumbComponent,
    ChunkPipe,
    AdminPanelComponent,
    CategoryManagementComponent,
    RecipeManagementComponent,
    ForbiddenPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatDividerModule,
    CommonModule,    
    MatStepperModule,
    MatTabsModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTableModule, // Ensure this is included
    MatSortModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
