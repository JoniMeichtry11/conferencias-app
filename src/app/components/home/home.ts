import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConferenceService } from '../../core/services/conference.service';
import { Arrangement } from '../../core/models/conference.models';
import { ConferenceCardComponent } from '../conference-card/conference-card';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ConferenceCardComponent, ThemeToggleComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  private conferenceService = inject(ConferenceService);

  // State
  viewMode = signal<'incoming' | 'outgoing'>('incoming');
  
  // Data from Firebase converted to Signal
  private allArrangements = toSignal(this.conferenceService.getArrangements(), { initialValue: [] as Arrangement[] });
  
  // Computed loading state
  loading = computed(() => this.allArrangements().length === 0);

  // Computed filtered data
  private filteredByMode = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.allArrangements()
      .filter(a => {
        if (this.viewMode() === 'incoming') {
          return a.type === 'incoming' || a.type === 'event';
        }
        return a.type === 'outgoing';
      })
      .filter(a => {
        const arrDate = new Date(a.date);
        arrDate.setHours(0, 0, 0, 0);
        return arrDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  // Computed: End of week boundary
  private endOfWeek = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDay = today.getDay();
    let daysUntilSaturday = currentDay === 6 ? 0 : (currentDay === 0 ? 6 : 6 - currentDay);
    
    const date = new Date(today);
    date.setDate(today.getDate() + daysUntilSaturday);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  // Final display signals
  thisWeekArrangements = computed(() => {
    const limit = this.endOfWeek();
    return this.filteredByMode().filter(a => new Date(a.date) <= limit);
  });

  futureArrangements = computed(() => {
    const limit = this.endOfWeek();
    return this.filteredByMode().filter(a => new Date(a.date) > limit);
  });

  setViewMode(mode: 'incoming' | 'outgoing') {
    this.viewMode.set(mode);
  }

  // Helper for empty state check in template
  hasArrangements = computed(() => this.allArrangements().length > 0);
}
