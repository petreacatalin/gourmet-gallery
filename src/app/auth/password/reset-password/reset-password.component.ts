import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { ResetPassword } from 'src/app/models/resetPassword.interface';
import { SpinnerService } from 'src/app/utils/spinner/spinner.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = '';
  email: string | null = '';
  showTokenExpired: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,    
    private spinnerService: SpinnerService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });

    if (!this.token || !this.email) {
      this.router.navigate(['/error']); // Redirect to an error page or handle appropriately
    }
  }

  onSubmit() {
    this.spinnerService.show();
    if (this.resetPasswordForm.valid && this.token && this.email) {
      const resetDto:ResetPassword = {
        email: this.email,
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword
      }
      this.authService.resetPassword(this.email,this.token, resetDto ).subscribe(
        response => {
          this.spinnerService.hide();
          console.log(response)
          this.router.navigate(['/reset-password-message']);
        },
        error => {
          this.spinnerService.hide();
          if(error){
            this.showTokenExpired = true;
          }
          console.log(error)
        }
      );
    }
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }
}
