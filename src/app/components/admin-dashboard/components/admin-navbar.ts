import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <nav class="sticky top-0 z-50 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#e0e0e0] dark:border-[#333333] px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm transition-colors duration-300">
      <div class="flex items-center gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#0054a6] dark:bg-[#4a9eff] flex items-center justify-center text-white shadow-md transition-all hover:scale-105">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm-1 7a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4zm10 0a1 1 0 001 1h6a1 1 0 001-1v-7a1 1 0 00-1-1h-6a1 1 0 00-1 1v7zm1-10h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v5a1 1 0 001 1z"/></svg>
        </div>
        <h1 class="text-xl sm:text-2xl font-semibold text-[#1a1a1a] dark:text-[#f5f5f5] tracking-tight">Panel de Administración</h1>
      </div>
      <div class="flex items-center gap-2 sm:gap-4">
        <app-theme-toggle></app-theme-toggle>
        @if (isAuthorized()) {
          <button (click)="logout.emit()" class="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm border border-red-100 dark:border-red-900/30" title="Cerrar Sesión">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        }
        <a routerLink="/" class="group flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold text-[#0054a6] dark:text-[#4a9eff] hover:text-[#003d7a] dark:hover:text-[#6bb3ff] hover:bg-[#e6f2ff] dark:hover:bg-[#1a3d66] transition-all duration-200">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span class="hidden sm:inline">Volver</span>
        </a>
      </div>
    </nav>
  `
})
export class AdminNavbarComponent {
  isAuthorized = input<boolean>(false);
  logout = output<void>();
}
