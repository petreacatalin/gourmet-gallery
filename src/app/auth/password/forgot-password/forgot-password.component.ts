import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  submitted = false;
  showInvalidLogin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  onForgotPasswordSubmit(): void {
    this.submitted = true;
    this.spinnerService.show();
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(
        response => {
          //alert('Password reset link sent to your email.');
          this.router.navigate(['reset-password-message']); // Redirect back to login
        
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          console.error('Failed to send password reset link', error);
          this.showInvalidLogin = true;
        }
      );
    } else {
      this.markFormGroupTouched(this.forgotPasswordForm);
      this.showInvalidLogin = false;
    }
    this.spinnerService.hide();
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
    return this.forgotPasswordForm.controls;
  }
}
