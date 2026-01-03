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
    const now = new Date();
    // Normalize today to start of day in local time
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Si es domingo, ya queremos mostrar lo de la semana siguiente (threshold = mañana)
    // De lo contrario, mostramos desde hoy (threshold = hoy)
    const threshold = now.getDay() === 0 ? new Date(today.getTime() + 24 * 60 * 60 * 1000) : today;
    
    return this.allArrangements()
      .filter(a => {
        if (this.viewMode() === 'incoming') {
          return a.type === 'incoming' || a.type === 'event';
        }
        return a.type === 'outgoing';
      })
      .filter(a => {
        // Parsear YYYY-MM-DD como fecha local
        const [year, month, day] = a.date.split('-').map(Number);
        const arrDate = new Date(year, month - 1, day);
        return arrDate >= threshold;
      })
      .sort((a, b) => {
        const [yA, mA, dA] = a.date.split('-').map(Number);
        const [yB, mB, dB] = b.date.split('-').map(Number);
        return new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime();
      });
  });

  // Computed: End of week boundary
  private endOfWeek = computed(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentDay = today.getDay(); // 0 (Dom) a 6 (Sab)
    
    // Queremos que el límite sea el próximo domingo.
    // Lunes(1) -> 6 días para el domingo
    // Sábado(6) -> 1 día para el domingo
    // Domingo(0) -> Ya queremos ver la semana que viene, así que el límite es el próximo domingo (7 días)
    let daysUntilSunday = currentDay === 0 ? 7 : (7 - currentDay);
    
    const date = new Date(today);
    date.setDate(today.getDate() + daysUntilSunday);
    date.setHours(23, 59, 59, 999);
    return date;
  });

  // Final display signals
  thisWeekArrangements = computed(() => {
    const limit = this.endOfWeek();
    return this.filteredByMode().filter(a => {
      const [year, month, day] = a.date.split('-').map(Number);
      const arrDate = new Date(year, month - 1, day);
      return arrDate <= limit;
    });
  });

  futureArrangements = computed(() => {
    const limit = this.endOfWeek();
    return this.filteredByMode().filter(a => {
      const [year, month, day] = a.date.split('-').map(Number);
      const arrDate = new Date(year, month - 1, day);
      return arrDate > limit;
    });
  });

  setViewMode(mode: 'incoming' | 'outgoing') {
    this.viewMode.set(mode);
  }

  // Helper for empty state check in template
  hasArrangements = computed(() => this.allArrangements().length > 0);
}
