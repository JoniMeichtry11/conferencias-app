import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Speaker } from '../../../core/models/conference.models';

@Component({
  selector: 'app-speakers-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      @for (speaker of speakers(); track speaker.id) {
        <div class="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg hover:border-[#0054a6] dark:hover:border-[#4a9eff] transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0054a6] dark:text-[#4a9eff]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white">{{ speaker.name }}</h3>
                <p class="text-xs font-bold text-[#555555] dark:text-[#aaaaaa] uppercase tracking-wider">{{ speaker.congregation }}</p>
              </div>
            </div>
            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button (click)="edit.emit(speaker)" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#0054a6]"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
              <button (click)="delete.emit(speaker.id)" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-[#555555] dark:text-[#aaaaaa]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>{{ speaker.phone || 'Sin teléfono' }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-2">
              @for (num of speaker.repertoire; track num) {
                <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-800">
                  #{{ num }}
                </span>
              } @empty {
                <span class="text-[10px] text-[#999999] italic">Sin temas asignados</span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SpeakersGridComponent {
  speakers = input<Speaker[]>([]);
  edit = output<Speaker>();
  delete = output<string | undefined>();
}
