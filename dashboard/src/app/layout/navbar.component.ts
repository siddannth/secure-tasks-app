// src/app/layout/navbar.component.ts
import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  isDark = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private renderer: Renderer2
  ) {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme') || 'light';
    this.isDark = theme === 'dark';
    if (this.isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
    }
  }

  get loggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
