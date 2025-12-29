import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 mb-8 bg-[#f5f5f5] dark:bg-[#262626] p-1.5 rounded-xl w-full sm:w-fit border border-[#e0e0e0] dark:border-[#333333] overflow-x-auto">
      @for (tab of tabs; track tab.id) {
        <button 
          (click)="tabChange.emit(tab.id)" 
          [class]="activeTab() === tab.id ? 'bg-white dark:bg-[#333333] text-[#0054a6] dark:text-[#4a9eff] shadow-sm' : 'text-[#666666] dark:text-[#999999] hover:text-[#1a1a1a] dark:hover:text-[#f5f5f5]'" 
          class="px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all cursor-pointer"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `
})
export class AdminTabsComponent {
  activeTab = input.required<string>();
  tabChange = output<string>();

  tabs = [
    { id: 'arrangements', label: 'Arreglos' },
    { id: 'speakers', label: 'Oradores' },
    { id: 'neighbors', label: 'Congregaciones' },
    { id: 'titles', label: 'Temas' }
  ];
}
