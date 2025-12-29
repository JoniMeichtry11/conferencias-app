import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceTitle } from '../../../core/models/conference.models';

@Component({
  selector: 'app-titles-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-[#1a1a1a] rounded-4xl border border-[#e5e7eb] dark:border-[#333333] shadow-xl overflow-hidden">
      <div class="max-h-[600px] overflow-y-auto">
        <table class="w-full text-left border-collapse">
          <thead class="sticky top-0 bg-[#f8f9fa] dark:bg-[#262626] z-20">
            <tr>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa] w-20">Número</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Título del Discurso</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa] text-center w-24">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e5e7eb] dark:divide-[#333333]">
            @for (t of titles(); track t.number) {
              <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 font-black text-[#0054a6] dark:text-[#4a9eff]">#{{ t.number }}</td>
                <td class="px-6 py-4 text-sm font-bold text-[#1a1a1a] dark:text-white">{{ t.title }}</td>
                <td class="px-6 py-4 text-center">
                  <button (click)="edit.emit(t)" class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#0054a6] transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TitlesTableComponent {
  titles = input<ConferenceTitle[]>([]);
  edit = output<ConferenceTitle>();
}
