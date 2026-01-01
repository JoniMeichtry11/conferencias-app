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
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Orador / Destino</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa]">Título Conferencia</th>
            <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-[#555555] dark:text-[#aaaaaa] text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e5e7eb] dark:divide-[#333333]">
          @for (arr of arrangements(); track arr.id) {
            <tr class="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group" [class.opacity-60]="isOldArrangement(arr)">
              <td class="px-6 py-5">
                <div class="flex flex-col">
                  <span class="text-[10px] font-bold text-[#0054a6] dark:text-[#4a9eff] uppercase tracking-wider mb-0.5">{{ arr.date | date:'EEE' }}</span>
                  <span class="text-sm font-black text-[#1a1a1a] dark:text-white">{{ arr.date | date:'d MMM' }}</span>
                  @if (isOldArrangement(arr)) {
                    <span class="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Hace +6 meses</span>
                  }
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
                    <span class="text-xs text-[#555555] dark:text-[#aaaaaa]">
                      @if (arr.type === 'incoming') {
                        Viene a Wheelwright
                      } @else if (arr.type === 'outgoing') {
                        Sale a {{ arr.location || 'Otra congregación' }}
                      }
                    </span>
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
                  @if (arr.type === 'incoming' || arr.type === 'outgoing') {
                    <button
                      (click)="whatsapp.emit(arr)"
                      class="p-2 cursor-pointer rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 hover:text-green-700 transition-all"
                      title="Enviar mensaje de WhatsApp"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </button>
                  }
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
  whatsapp = output<Arrangement>();

  isOldArrangement(arr: Arrangement): boolean {
    const arrangementDate = new Date(arr.date);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return arrangementDate < sixMonthsAgo;
  }
}
