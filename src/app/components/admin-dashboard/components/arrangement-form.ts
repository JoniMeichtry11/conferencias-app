import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { Speaker, NeighborCongregation, ConferenceTitle } from '../../../core/models/conference.models';

@Component({
  selector: 'app-arrangement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="submit.emit()" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Fecha</label>
          <input type="date" formControlName="date" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Horario</label>
          <input type="text" formControlName="time" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-center text-[#1a1a1a] dark:text-white">
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Tipo de Arreglo</label>
        <div class="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 bg-[#f8f9fa] dark:bg-[#262626] rounded-2xl border-2 border-[#e5e7eb] dark:border-[#333333]">
          <button type="button" (click)="form().patchValue({type: 'incoming'})" [class]="form().get('type')?.value === 'incoming' ? 'bg-[#0054a6] text-white shadow-lg' : 'text-[#666666] dark:text-[#999999] hover:bg-white dark:hover:bg-[#333333]'" class="py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all">Visita</button>
          <button type="button" (click)="form().patchValue({type: 'outgoing'})" [class]="form().get('type')?.value === 'outgoing' ? 'bg-[#d97706] text-white shadow-lg' : 'text-[#666666] dark:text-[#999999] hover:bg-white dark:hover:bg-[#333333]'" class="py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all">Salida</button>
          <button type="button" (click)="form().patchValue({type: 'event'})" [class]="form().get('type')?.value === 'event' ? 'bg-[#10b981] text-white shadow-lg' : 'text-[#666666] dark:text-[#999999] hover:bg-white dark:hover:bg-[#333333]'" class="py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all">Evento</button>
        </div>
      </div>

      @if (form().get('type')?.value !== 'event') {
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">1. Filtrar por Congregación</label>
            <select [ngModel]="selectedCongreFilter()" (ngModelChange)="selectedCongreFilterChange.emit($event)" [ngModelOptions]="{standalone: true}" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold appearance-none text-[#1a1a1a] dark:text-white">
              <option value="" class="dark:bg-[#1a1a1a]">Todas las congregaciones</option>
              @for (n of neighbors(); track n.id) {
                <option [value]="n.name" class="dark:bg-[#1a1a1a]">{{ n.name }}</option>
              }
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">2. Buscar por Nº de Tema</label>
            <div class="relative">
              <input type="number" [ngModel]="desiredTalkNumber()" (ngModelChange)="desiredTalkNumberChange.emit($event)" [ngModelOptions]="{standalone: true}" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white" placeholder="Ej: 45">
              @if (desiredTalkNumber()) {
                <span (click)="desiredTalkNumberChange.emit(null)" class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500 cursor-pointer">Limpiar</span>
              }
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">3. Seleccionar Orador</label>
          <select formControlName="speakerId" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#0054a6]/30 dark:border-[#4a9eff]/30 rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold appearance-none shadow-sm shadow-blue-500/5 text-[#1a1a1a] dark:text-white">
            <option value="" class="dark:bg-[#1a1a1a]">{{ availableSpeakers().length ? 'Seleccionar orador...' : 'No hay oradores con estos filtros' }}</option>
            @for (s of availableSpeakers(); track s.id) {
              <option [value]="s.id" class="dark:bg-[#1a1a1a]">{{ s.name }} ({{ s.congregation }})</option>
            }
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">4. Seleccionar Tema del Orador</label>
          <select formControlName="conferenceNumber" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold appearance-none text-[#1a1a1a] dark:text-white">
            <option [ngValue]="null" class="dark:bg-[#1a1a1a]">Seleccionar tema del repertorio...</option>
            @if (selectedSpeakerRepertoire().length > 0) {
              <optgroup label="Repertorio del Orador" class="dark:bg-[#1a1a1a]">
                @for (t of selectedSpeakerTitles(); track t.number) {
                  <option [value]="t.number" [class.bg-blue-50]="t.number === desiredTalkNumber()" class="dark:bg-[#1a1a1a]">#{{ t.number }} - {{ t.title }}</option>
                }
              </optgroup>
            }
            <optgroup label="Otros Temas (Fuera de repertorio)" class="dark:bg-[#1a1a1a]">
              @for (t of titles(); track t.number) {
                <option [value]="t.number" class="dark:bg-[#1a1a1a]">#{{ t.number }} - {{ t.title }}</option>
              }
            </optgroup>
          </select>
        </div>
      }

      @if (form().get('type')?.value === 'event') {
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Nombre del Evento / Etiqueta</label>
          <input type="text" formControlName="customLabel" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white" placeholder="Ej: Visita SC, Asamblea...">
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Cántico</label>
          <input type="number" formControlName="songNumber" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-center text-[#1a1a1a] dark:text-white" placeholder="#">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Ubicación (Si aplica)</label>
          <input type="text" formControlName="location" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white" placeholder="Lugar...">
        </div>
      </div>

      <div class="flex gap-4 pt-6">
        <button type="button" (click)="cancel.emit()" class="flex-1 px-5 py-4 rounded-2xl font-black uppercase text-xs text-[#666666] hover:bg-[#f8f9fa] dark:hover:bg-[#262626] transition-all border-2 border-transparent">Cancelar</button>
        <button type="submit" [disabled]="form().invalid" class="flex-1 px-5 py-4 bg-[#0054a6] dark:bg-[#4a9eff] text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95">Guardar</button>
      </div>
    </form>
  `
})
export class ArrangementFormComponent {
  form = input.required<FormGroup>();
  availableSpeakers = input<Speaker[]>([]);
  neighbors = input<NeighborCongregation[]>([]);
  titles = input<ConferenceTitle[]>([]);
  
  selectedCongreFilter = input<string>('');
  desiredTalkNumber = input<number | null>(null);
  
  selectedSpeakerRepertoire = input<number[]>([]);
  selectedSpeakerTitles = input<ConferenceTitle[]>([]);

  selectedCongreFilterChange = output<string>();
  desiredTalkNumberChange = output<number | null>();
  
  submit = output<void>();
  cancel = output<void>();
}
