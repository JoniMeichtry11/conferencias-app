import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
      <div class="bg-white dark:bg-[#1a1a1a] p-8 sm:p-12 rounded-[2.5rem] border-2 border-[#e5e7eb] dark:border-[#333333] shadow-2xl w-full max-max-md text-center">
        <div class="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-[#0054a6] dark:text-[#4a9eff] mx-auto mb-6">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-black text-[#1a1a1a] dark:text-white mb-2 tracking-tight">Acceso Restringido</h2>
        <p class="text-sm text-[#666666] dark:text-[#999999] mb-8 font-medium">Ingresa la clave de administrador para continuar.</p>
        
        <div class="space-y-4">
          <input 
            type="password" 
            [(ngModel)]="password" 
            (keyup.enter)="login.emit()"
            placeholder="Contraseña" 
            class="w-full px-6 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-center font-bold text-[#1a1a1a] dark:text-white"
          >
          @if (error()) {
            <div class="text-red-500 text-xs font-bold animate-bounce">{{ error() }}</div>
          }
          <button 
            (click)="login.emit()" 
            class="w-full py-4 bg-[#0054a6] dark:bg-[#4a9eff] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  password = model('');
  error = input<string | null>(null);
  login = output<void>();
}
