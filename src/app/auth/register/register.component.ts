import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationUser } from 'src/app/models/applicationUser.interface';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  duplicateUser: boolean = false;
  errorMessages: { [key: string]: string } = {
    PasswordRequiresNonAlphanumeric: 'Password must have at least one non-alphanumeric character.',
    PasswordRequiresLower: 'Password must have at least one lowercase letter.',
    PasswordRequiresUpper: 'Password must have at least one uppercase letter.'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData: ApplicationUser = this.registerForm.value;
      this.authService.register(userData).subscribe(
        response => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']); // Navigate to login page upon successful registration
        },
        error => {
          console.error('Registration failed', error);
          if (error.status === 400 && error.error) {
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
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

}
