import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showForgotPasswordForm = false;
  submitted = false;
  showInvalidLogin: boolean = false;
  emailNotConfirmed: boolean = false;
  isGoogleButtonRendered = false;  // Track if the Google button is rendered or not

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService,
    private ngZone: NgZone,
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  
  ngOnInit(): void {
   // this.initializeGoogleSignIn();
  }
  ngAfterViewInit(): void {
    this.initializeGoogleSignIn();
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onSubmit(): void {
    this.spinnerService.show();
    this.submitted = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          this.spinnerService.hide();
          this.router.navigate(['/mainpage']);
        },
        error => {
          console.error('Login failed', error);
          if(!error.result && !(error.error.errors[0].includes("Email not confirmed"))){
            this.showInvalidLogin = true;
          }
          if(!error.result && (error.error.errors[0].includes("Email not confirmed"))){
            this.showInvalidLogin = false;
            this.emailNotConfirmed = true;
          }
          this.spinnerService.hide();
        }
      );
    } 
    else {
      this.markFormGroupTouched(this.loginForm);
      this.spinnerService.hide();

    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }
 

  // Initialize Google Sign-In button
  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '699433768038-tip0u2mr5q20vhkm41gjkk5cdk0j6hs2.apps.googleusercontent.com',  
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-sign-in-button')!, 
      { theme: 'outline', size: 'large' }
    );
  }

  // Handle the Google Sign-In response
  handleGoogleSignIn(response: any): void {
    if (response?.credential) {
      // Send the ID token to the backend for validation
      this.authService.googleLogin(response.credential).subscribe(
        (result) => {
          this.ngZone.run(() => {
            this.router.navigate(['/mainpage']);  // Redirect after successful login
          });
        },
        (error) => {
          console.error('Google login failed', error);
        }
      );
    }
  }
}
