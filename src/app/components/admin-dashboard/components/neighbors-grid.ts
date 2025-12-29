import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeighborCongregation } from '../../../core/models/conference.models';

@Component({
  selector: 'app-neighbors-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      @for (n of neighbors(); track n.id) {
        <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg hover:border-[#0054a6] dark:hover:border-[#4a9eff] transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white">{{ n.name }}</h3>
                <p class="text-xs font-bold text-[#555555] dark:text-[#aaaaaa] uppercase tracking-wider">{{ n.town }}</p>
              </div>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="edit.emit(n)" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#0054a6]"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              <button (click)="delete.emit(n.id)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-[#f3f4f6] dark:border-[#333333] space-y-2">
            <p class="text-xs font-black text-[#666666] dark:text-[#999999] uppercase tracking-widest mb-1">Coordinador</p>
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-[#1a1a1a] dark:text-white">{{ n.coordinatorName }}</span>
              <span class="text-xs text-[#0054a6] dark:text-[#4a9eff] font-black">{{ n.coordinatorPhone }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class NeighborsGridComponent {
  neighbors = input<NeighborCongregation[]>([]);
  edit = output<NeighborCongregation>();
  delete = output<string | undefined>();
}
