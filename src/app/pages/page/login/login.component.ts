import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isLogin = true;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      strPhone: ['', Validators.required],
      strPassword: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      strName: ['', Validators.required],
      strPassword: ['', Validators.required],
      strEmail: [''],
      strPhone: ['']
    }, { validators: this.atLeastOne(['strEmail', 'strPhone']) });
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  atLeastOne(fields: string[]) {
    return (form: FormGroup) => {
      const hasAtLeastOne = fields.some(field => form.get(field)?.value);
      return hasAtLeastOne ? null : { atLeastOneRequired: true };
    };
  }

  onLogin() {
    if (this.loginForm.valid) {
      const obj = {
        strPhone: this.loginForm.value.strPhone,
        strPassword: this.loginForm.value.strPassword,
      }

      this.fnAuthCall(obj, 'login');
    } else {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fill in all required fields.', 'Validation Error');
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      console.log('Signup Data:', signupData);

      this.fnAuthCall(signupData, 'signup');
    } else {
      this.signupForm.markAllAsTouched();
      this.toastr.error('Please complete the signup form properly.', 'Validation Error');
    }
  }

  fnAuthCall(obj: any, auth: string) {
    if (auth === 'login') {
      this.authService.login(obj).subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'Login successful!', 'Success');
          console.log(res);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.error?.message || 'Login failed.', 'Error');
        }
      });
    } else {
      this.authService.signup(obj).subscribe({
        next: (res) => {
          this.toastr.success(res.message || 'Signup successful!', 'Success');
          console.log(res);
          this.isLogin = true
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(err.error?.message || 'Signup failed.', 'Error');
        }
      });
    }
  }

}
