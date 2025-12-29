import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-neighbor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="handleFormSubmit($event)" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Congregación</label>
          <input type="text" formControlName="name" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white" placeholder="Ej: Hughes Centro">
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Pueblo / Ciudad</label>
          <input type="text" formControlName="town" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white" placeholder="Ej: Hughes">
        </div>
      </div>
      <div class="space-y-6 pt-4 border-t border-[#f3f4f6] dark:border-[#333333]">
        <h4 class="text-xs font-black text-[#1a1a1a] dark:text-white uppercase tracking-widest italic">Datos del Coordinador</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Nombre</label>
            <input type="text" formControlName="coordinatorName" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">WhatsApp / Cel</label>
            <input type="text" formControlName="coordinatorPhone" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
          </div>
        </div>
      </div>
      <div class="flex gap-4 pt-4">
        <button type="button" (click)="cancel.emit()" class="flex-1 px-5 py-4 rounded-2xl font-black uppercase text-xs text-[#666666] dark:text-[#999999] hover:bg-[#f8f9fa] dark:hover:bg-[#262626] transition-all">Cancelar</button>
        <button type="submit" [disabled]="form().invalid || isSaving() || localLoading()" class="flex-1 px-5 py-4 bg-[#0054a6] dark:bg-[#4a9eff] text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">
          {{ (isSaving() || localLoading()) ? 'Guardando...' : 'Guardar Congregación' }}
        </button>
      </div>
    </form>
  `
})
export class NeighborFormComponent {
  form = input.required<FormGroup>();
  isSaving = input<boolean>(false);
  localLoading = signal(false);
  formSubmit = output<void>();
  cancel = output<void>();

  handleFormSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.localLoading() || this.isSaving()) return;
    this.localLoading.set(true);
    this.formSubmit.emit();
    setTimeout(() => this.localLoading.set(false), 2000);
  }
}
