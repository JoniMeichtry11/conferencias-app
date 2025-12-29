import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { NeighborCongregation, ConferenceTitle } from '../../../core/models/conference.models';

@Component({
  selector: 'app-speaker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="handleFormSubmit($event)" class="space-y-6">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
        <input type="text" formControlName="name" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Congregación</label>
          <div class="relative">
            <select formControlName="congregation" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold appearance-none text-[#1a1a1a] dark:text-white">
              <option value="" class="dark:bg-[#1a1a1a]">Seleccionar congregación...</option>
              @for (n of neighbors(); track n.id) {
                <option [value]="n.name" class="dark:bg-[#1a1a1a]">{{ n.name }}</option>
              }
              <option value="CUSTOM" class="dark:bg-[#1a1a1a]">-- Otra (Escribir abajo) --</option>
            </select>
          </div>
          @if (form().get('congregation')?.value === 'CUSTOM') {
            <input type="text" (blur)="onCustomCongregationBlur($event)" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#0054a6] rounded-2xl outline-none text-sm font-bold mt-2 text-[#1a1a1a] dark:text-white" placeholder="Escribe el nombre de la otra congregación...">
          }
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Teléfono</label>
          <input type="text" formControlName="phone" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
        </div>
      </div>
      <div class="flex items-center gap-3 ml-1">
        <input type="checkbox" formControlName="isLocal" id="isLocal" class="w-5 h-5 accent-[#0054a6]">
        <label for="isLocal" class="text-sm font-bold text-[#1a1a1a] dark:text-white">Es orador local</label>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Repertorio de Temas</label>
        <div class="p-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl max-h-48 overflow-y-auto space-y-2">
          @for (t of titles(); track t.number) {
            <div (click)="toggleRepertoire.emit(t.number)" class="flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all" [class.bg-emerald-50]="isTitleInRepertoire(t.number)" [class.dark:bg-emerald-900/30]="isTitleInRepertoire(t.number)">
              <span class="text-xs font-bold" [class.text-emerald-600]="isTitleInRepertoire(t.number)" [class.dark:text-emerald-400]="isTitleInRepertoire(t.number)" [class.dark:text-white]="!isTitleInRepertoire(t.number)">{{ t.number }} - {{ t.title }}</span>
              <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" [class.border-emerald-500]="isTitleInRepertoire(t.number)" [class.bg-emerald-500]="isTitleInRepertoire(t.number)" [class.border-[#e5e7eb]]="!isTitleInRepertoire(t.number)">
                @if (isTitleInRepertoire(t.number)) {
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <div class="flex gap-4 pt-4">
        <button type="button" (click)="cancel.emit()" class="flex-1 px-5 py-4 rounded-2xl font-black uppercase text-xs text-[#666666] dark:text-[#999999] hover:bg-[#f8f9fa] dark:hover:bg-[#262626] transition-all">Cancelar</button>
        <button type="submit" [disabled]="form().invalid || isSaving() || localLoading()" class="flex-1 px-5 py-4 bg-[#0054a6] dark:bg-[#4a9eff] text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
          {{ (isSaving() || localLoading()) ? 'Guardando...' : 'Guardar Orador' }}
        </button>
      </div>
    </form>
  `
})
export class SpeakerFormComponent {
  form = input.required<FormGroup>();
  isSaving = input<boolean>(false);
  localLoading = signal(false);
  neighbors = input<NeighborCongregation[]>([]);
  titles = input<ConferenceTitle[]>([]);
  repertoire = input<number[]>([]);
  
  formSubmit = output<void>();
  cancel = output<void>();
  toggleRepertoire = output<number>();

  isTitleInRepertoire(num: number): boolean {
    return this.repertoire().includes(num);
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.localLoading()) return;
    this.localLoading.set(true);
    this.formSubmit.emit();
    // Re-enable after a short delay in case of parent failure
    setTimeout(() => this.localLoading.set(false), 2000);
  }

  onCustomCongregationBlur(event: any) {
    this.form().patchValue({ congregation: event.target.value });
  }
}
