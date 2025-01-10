import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';
import { NgZone } from '@angular/core';
import { ToastService } from 'src/app/utils/toast/toast.service';

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
  confirmationSent: boolean = false;
  isGoogleButtonRendered = false;  // Track if the Google button is rendered or not
  requestLimiter:boolean = false;
  alertMessage:string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService,
    private ngZone: NgZone,
    private toastService: ToastService
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
    // Show spinner to indicate a loading state
    this.spinnerService.show();

    // Set initial state for flags
    this.submitted = true;
    this.resetStateFlags();

    // Proceed if the form is valid
    if (this.loginForm.valid) {
        this.authService.login(this.loginForm.value).subscribe({
            next: (response) => this.handleLoginSuccess(),
            error: (error) => this.handleLoginError(error),
            complete: () => this.spinnerService.hide()
        });
    } else {
        // If the form is invalid, mark all fields as touched
        this.markFormGroupTouched(this.loginForm);
        this.spinnerService.hide();
    }
}

/**
 * Reset all state flags for the login process
 */
private resetStateFlags(): void {
    this.showInvalidLogin = false;
    this.emailNotConfirmed = false;
    this.confirmationSent = false;
}

/**
 * Handle successful login
 */
private handleLoginSuccess(): void {
    this.spinnerService.hide();
    this.triggerSuccess('Welcome back!');
    this.triggerSuccess('You’re now logged in!');
    this.router.navigate(['/mainpage']);
}

/**
 * Handle login error
 * @param error - Error object from the login request
 */
private handleLoginError(error: any): void {
    console.error('Login failed', error);
    this.spinnerService.hide();

    if (!error.result) {
        const errorMessage = error.error.errors?.[0] || '';

        if (errorMessage.includes("Email not confirmed")) {
            this.emailNotConfirmed = true;
            this.showInvalidLogin = false;
        } else {
            this.showInvalidLogin = true;
        }
    }
}



      onResendConfirmation(): void {
        // Show the spinner at the start of the operation
        this.spinnerService.show();

        // Ensure the login form is valid
        if (this.loginForm.valid) {
          this.authService.resendConfirmationEmail(this.loginForm.value).subscribe({
            next: (response) => {
              this.handleSuccessResponse(response);
            },
            error: (error) => {
              this.handleErrorResponse(error);
            },
            complete: () => {
              // Always hide the spinner when the operation is complete
              this.spinnerService.hide();
            }
          });
        } else {
          // Hide the spinner if the form is invalid
          this.spinnerService.hide();
        }
      }

      /**
       * Handle the successful response from the resend confirmation API
       */
      private handleSuccessResponse(response: any): void {
        this.spinnerService.hide();
        if (response.code === 200) {
          this.showInvalidLogin = false;
          this.emailNotConfirmed = false;
          this.confirmationSent = true;
        } else {
          this.confirmationSent = false;
        }
      }

      private handleErrorResponse(error: any): void {
        this.spinnerService.hide();
    
        if (error.status === 429) {
            // Handle rate-limiting errors
            this.requestLimiter = true;
            this.confirmationSent = false;
    
            // Extract and format the time from the error message
            const waitTime = this.extractTimeFromError(error.error);
            this.alertMessage = waitTime
                ? `You need to wait ${waitTime} before resending the confirmation email.`
                : "You have reached the rate limit. Please try again later.";
        } else {
            // Handle other errors
            this.alertMessage = "An unexpected error occurred. Please try again.";
            this.requestLimiter = false;
        }
    }

      private extractTimeFromError(errorMessage: string): string | null {
        const timeMatch = errorMessage?.match(/(\d{2}:\d{2}:\d{2})/);

        if (timeMatch) {
          const dynamicTime = timeMatch[1]; // Extracted time, e.g., "00:15:00"
          return `${dynamicTime} minutes`; // Return the formatted time
        }

        console.error("Time not found in the error message.");
        return null;
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
 
  triggerSuccess(text?: string): void {
    this.toastService.showToast(text!, 'success');
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
            this.triggerSuccess('Welcome back!');
            this.triggerSuccess('You’re now logged in!');
          });
        },
        (error) => {
          console.error('Google login failed', error);
        }
      );
    }
  }
}
