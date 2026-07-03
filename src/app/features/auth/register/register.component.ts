import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName: string = '';
  companyName: string = '';
  email: string = '';
  password: string = '';

  isLoading = false;
  errorMessage = '';

  showPassword = false;

  constructor(private authSvc: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    // Basic validation
    if (!this.fullName || !this.companyName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      userName: this.fullName,     
      tenantName: this.companyName, 
      emailId: this.email,
      password: this.password
    };

    this.authSvc.register(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful!', response);
        // Successfully created! Send them to login.
        this.router.navigate(['/signin']); 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration failed', err);
        // Show the error from Spring Boot (e.g., "Email already exists")
        this.errorMessage = err.error?.message || 'Failed to create workspace. Please try again.';
      }
    });
  }
}
