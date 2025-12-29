import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'conferencias-app-theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      // Use saved preference
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // No saved preference - default to light mode
      this.isDarkMode.set(false);
      localStorage.setItem(this.THEME_KEY, 'light');
    }
    
    // Apply the theme immediately
    this.applyTheme();
  }

  toggleTheme() {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    const themeValue = newValue ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, themeValue);
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;
    const isDark = this.isDarkMode();
    
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    }
  }
}
