import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessages: { [key: string]: string } = {
    'DuplicateUserName': 'This email is already registered.',
    // Add more error messages as needed
  };

  hidePassword: boolean = true; // to toggle password visibility
  hideConfirmPassword: boolean = true; // to toggle confirm password visibility


  constructor(
     private fb: FormBuilder,
     private authService: AuthService,
     private router: Router,
     private spinnerService: SpinnerService,
    
    ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.spinnerService.show();
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.authService.register(userData).subscribe(
        response => {
          this.router.navigate(['/login']);
          this.spinnerService.hide();
        },
        error => {
          console.error('Registration failed', error);
          if (error.status === 400 || error.error) {
            const errorArray = error.error;
            if (Array.isArray(errorArray)) {
              errorArray.forEach(err => {
                if (err.code === 'DuplicateUserName') {
                  this.registerForm.get('email')?.setErrors({ duplicateUserName: true });
                } else {
                  const errorMessage = this.errorMessages[err.code];
                  if (errorMessage) {
                    this.registerForm.get('password')?.setErrors({ backendError: errorMessage });
                    this.registerForm.get('confirmPassword')?.setErrors({ backendError: errorMessage });
                  }
                }
              });
              this.registerForm.updateValueAndValidity(); // Trigger validation checks
            }
          }
        }
      );
    } else {
      // Ensure all form controls are marked as touched to trigger validation messages
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
    this.spinnerService.hide();
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
