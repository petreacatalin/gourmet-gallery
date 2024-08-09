import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  
  ngOnInit(): void {
    // Initialize any settings if needed
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
          if(!error.result)
            this.showInvalidLogin = true;
          this.spinnerService.hide();
        }
      );
    } else {
      this.markFormGroupTouched(this.loginForm);
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
}
