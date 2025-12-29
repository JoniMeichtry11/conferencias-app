import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Arrangement } from '../../../core/models/conference.models';

@Component({
  selector: 'app-arrangements-table',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="overflow-x-auto bg-white dark:bg-[#1a1a1a] rounded-4xl border border-[#e5e7eb] dark:border-[#333333] shadow-xl">
      <table class="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr class="bg-[#f8f9fa] dark:bg-[#262626] border-b border-[#e5e7eb] dark:border-[#333333]">
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Fecha</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Arreglo</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Orador / Congre</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Título Conferencia</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa] text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e5e7eb] dark:divide-[#333333]">
          @for (arr of arrangements(); track arr.id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-[#0054a6] dark:text-[#4a9eff] uppercase tracking-wider mb-0.5">{{ arr.date | date:'EEE' }}</span>
                  <span class="text-sm font-black text-[#1a1a1a] dark:text-white">{{ arr.date | date:'d MMM' }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <span 
                  [ngClass]="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200': arr.type === 'incoming',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200': arr.type === 'outgoing',
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200': arr.type === 'event'
                  }"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-transparent"
                >
                  {{ arr.type === 'incoming' ? 'Visita' : arr.type === 'outgoing' ? 'Salida' : 'Evento' }}
                </span>
              </td>
              <td class="px-6 py-5">
                @if (arr.type !== 'event') {
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-[#1a1a1a] dark:text-white">{{ arr.speakerName }}</span>
                    <span class="text-xs text-[#555555] dark:text-[#aaaaaa]">{{ arr.speakerCongregation }}</span>
                  </div>
                } @else {
                  <span class="text-sm italic text-[#555555] dark:text-[#aaaaaa]">Múltiple</span>
                }
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1">
                  @if (arr.conferenceNumber) {
                    <span class="text-[9px] font-black text-[#16a34a] dark:text-[#4ade80] uppercase">Conferencia #{{ arr.conferenceNumber }}</span>
                  }
                  <p class="text-sm font-bold text-[#1a1a1a] dark:text-white line-clamp-1 italic">{{ arr.conferenceTitle }}</p>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button (click)="edit.emit(arr)" class="p-2 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-[#0054a6] transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button (click)="delete.emit(arr.id)" class="p-2 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ArrangementsTableComponent {
  arrangements = input<Arrangement[]>([]);
  edit = output<Arrangement>();
  delete = output<string | undefined>();
}
