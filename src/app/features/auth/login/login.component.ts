import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  showPassword = false;

  isLoading = false;
  errorMessage = '';

  constructor(private authSvc: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit() {
    if (!this.email || !this.password) return;
    
    this.isLoading = true;
    const credentials = { emailId: this.email, password: this.password };

    this.authSvc.login(credentials).subscribe({
      next: (initData) => {
        console.log('Login and Init successful! Welcome,', initData.userName);
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(['/app']); 
        }, 400);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password.';
      }
    });
  }

  onSocialLogin(provider: string) {
    console.log('SSO login with:', provider);
  }
}
