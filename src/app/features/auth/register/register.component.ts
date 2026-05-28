import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  onSubmit(): void {
    console.log('Registering:', {
      name: this.fullName,
      company: this.companyName,
      email: this.email,
      password: this.password
    });
  }
}
