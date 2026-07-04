import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  public authService = inject(AuthService);

  user = this.authService.currentUser;

  isSidebarCollapsed: boolean = false;

  isUserMenuOpen: boolean = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    console.log(this.user());
  }

  onLogout(): void {
    this.authService.logout();
  }
}
