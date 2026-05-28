import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  onSubmit() {
    console.log('Authenticating:', { email: this.email, password: this.password });
    // Later, you will call your AuthService here and navigate to /app/dashboard
  }

  onSocialLogin(provider: string) {
    console.log('SSO login with:', provider);
  }
}
