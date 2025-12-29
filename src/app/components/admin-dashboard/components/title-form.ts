import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-title-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form()" (ngSubmit)="submit.emit()" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="sm:col-span-1 space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Número</label>
          <input type="number" formControlName="number" [readonly]="readonlyNumber()" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-center text-[#1a1a1a] dark:text-white">
        </div>
        <div class="sm:col-span-3 space-y-2">
          <label class="text-[10px] font-black text-[#666666] dark:text-[#999999] uppercase tracking-[0.2em] ml-1">Título del Discurso</label>
          <input type="text" formControlName="title" class="w-full px-5 py-4 bg-[#f8f9fa] dark:bg-[#262626] border-2 border-[#e5e7eb] dark:border-[#333333] rounded-2xl focus:border-[#0054a6] outline-none transition-all text-sm font-bold text-[#1a1a1a] dark:text-white">
        </div>
      </div>
      <div class="flex gap-4 pt-4">
        <button type="button" (click)="cancel.emit()" class="flex-1 px-5 py-4 rounded-2xl font-black uppercase text-xs text-[#666666] dark:text-[#999999] hover:bg-[#f8f9fa] dark:hover:bg-[#262626] transition-all">Cancelar</button>
        <button type="submit" [disabled]="form().invalid" class="flex-1 px-5 py-4 bg-[#0054a6] dark:bg-[#4a9eff] text-white rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Guardar Tema</button>
      </div>
    </form>
  `
})
export class TitleFormComponent {
  form = input.required<FormGroup>();
  readonlyNumber = input<boolean>(false);
  submit = output<void>();
  cancel = output<void>();
}
