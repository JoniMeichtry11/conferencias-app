import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceService } from '../../../core/services/conference.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Arrangement, Speaker } from '../../../core/models/conference.models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-[#1a1a1a] dark:text-[#f5f5f5] tracking-tight">Estadísticas de Conferencias</h2>
        <p class="text-sm sm:text-base text-[#555555] dark:text-[#aaaaaa] mt-0.5">Análisis de datos para optimizar futuros arreglos.</p>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-[#1a1a1a] dark:text-white">{{ totalArrangements() }}</p>
              <p class="text-xs font-bold text-[#666666] dark:text-[#aaaaaa] uppercase tracking-wider">Total Arreglos</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-[#1a1a1a] dark:text-white">{{ totalSpeakers() }}</p>
              <p class="text-xs font-bold text-[#666666] dark:text-[#aaaaaa] uppercase tracking-wider">Oradores Activos</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-[#1a1a1a] dark:text-white">{{ upcomingArrangements() }}</p>
              <p class="text-xs font-bold text-[#666666] dark:text-[#aaaaaa] uppercase tracking-wider">Próximos Arreglos</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-[#1a1a1a] dark:text-white">{{ avgConferencesPerMonth() }}</p>
              <p class="text-xs font-bold text-[#666666] dark:text-[#aaaaaa] uppercase tracking-wider">Promedio Mensual</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Grids -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Conferences by Type -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Arreglos por Tipo</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span class="font-bold text-[#1a1a1a] dark:text-white">Visitas</span>
              </div>
              <span class="text-xl font-black text-blue-600 dark:text-blue-400">{{ conferencesByType().incoming }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span class="font-bold text-[#1a1a1a] dark:text-white">Salidas</span>
              </div>
              <span class="text-xl font-black text-amber-600 dark:text-amber-400">{{ conferencesByType().outgoing }}</span>
            </div>
            <div class="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span class="font-bold text-[#1a1a1a] dark:text-white">Eventos</span>
              </div>
              <span class="text-xl font-black text-emerald-600 dark:text-emerald-400">{{ conferencesByType().events }}</span>
            </div>
          </div>
        </div>

        <!-- Top Speakers -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Oradores Más Solicitados</h3>
          <div class="space-y-3">
            @for (speaker of topSpeakers(); track speaker.name) {
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-[#0054a6] dark:bg-[#4a9eff] rounded-lg flex items-center justify-center">
                    <span class="text-xs font-black text-white">{{ speaker.count }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-[#1a1a1a] dark:text-white">{{ speaker.name }}</p>
                    <p class="text-xs text-[#666666] dark:text-[#aaaaaa]">{{ speaker.congregation }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Monthly Distribution -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Distribución Mensual</h3>
          <div class="grid grid-cols-3 gap-2">
            @for (month of monthlyStats(); track month.name) {
              <div class="text-center p-3 bg-gray-50 dark:bg-[#262626] rounded-lg">
                <div class="text-xs font-bold text-[#666666] dark:text-[#aaaaaa] uppercase">{{ month.name }}</div>
                <div class="text-lg font-black text-[#0054a6] dark:text-[#4a9eff]">{{ month.count }}</div>
              </div>
            }
          </div>
        </div>

        <!-- Top Titles -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Temas Más Usados</h3>
          <div class="space-y-3">
            @for (title of topTitles(); track title.title) {
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#262626] rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-[#10b981] dark:bg-[#34d399] rounded-lg flex items-center justify-center">
                    <span class="text-xs font-black text-white">{{ title.count }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-[#1a1a1a] dark:text-white line-clamp-1">{{ title.title }}</p>
                    <p class="text-xs text-[#666666] dark:text-[#aaaaaa]">#{{ title.number }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Additional Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Weekend Utilization -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Utilización de Fines de Semana</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#666666] dark:text-[#aaaaaa]">Fines de semana ocupados</span>
              <span class="text-lg font-black text-green-600 dark:text-green-400">{{ weekendUtilization().occupied }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-[#666666] dark:text-[#aaaaaa]">Fines de semana libres</span>
              <span class="text-lg font-black text-red-600 dark:text-red-400">{{ weekendUtilization().free }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-[#0054a6] dark:bg-[#4a9eff] h-2 rounded-full" [style.width.%]="weekendUtilization().percentage"></div>
            </div>
            <p class="text-xs text-[#666666] dark:text-[#aaaaaa] text-center">{{ weekendUtilization().percentage }}% de ocupación</p>
          </div>
        </div>

        <!-- Congregation Stats -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Estadísticas por Congregación</h3>
          <div class="space-y-3">
            @for (cong of congregationStats(); track cong.name) {
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#262626] rounded-lg">
                <span class="text-sm font-bold text-[#1a1a1a] dark:text-white truncate">{{ cong.name }}</span>
                <span class="text-sm font-black text-[#0054a6] dark:text-[#4a9eff]">{{ cong.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#e5e7eb] dark:border-[#333333] shadow-lg">
          <h3 class="text-lg font-black text-[#1a1a1a] dark:text-white mb-4">Actividad Reciente</h3>
          <div class="space-y-3">
            @for (activity of recentActivity(); track activity.id) {
              <div class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-[#262626] rounded-xl">
                <div class="w-2 h-2 bg-[#0054a6] dark:bg-[#4a9eff] rounded-full mt-2 flex-shrink-0"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-[#1a1a1a] dark:text-white">{{ activity.title }}</p>
                  <p class="text-xs text-[#666666] dark:text-[#aaaaaa]">{{ activity.date | date:'d MMM' }} - {{ activity.speaker }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatisticsComponent {
  private conferenceService = inject(ConferenceService);

  // Data signals
  arrangements = toSignal(this.conferenceService.getArrangements(), { initialValue: [] as Arrangement[] });
  speakers = toSignal(this.conferenceService.getSpeakers(), { initialValue: [] as Speaker[] });

  // Computed statistics
  totalArrangements = computed(() => {
    const arrangements = this.arrangements();
    return arrangements.length;
  });

  totalSpeakers = computed(() => {
    const speakers = this.speakers();
    return speakers.length;
  });

  upcomingArrangements = computed(() => {
    const arrangements = this.arrangements();
    const today = new Date();
    return arrangements.filter((arr: Arrangement) => new Date(arr.date) >= today).length;
  });

  avgConferencesPerMonth = computed(() => {
    const arrangements = this.arrangements();
    if (arrangements.length === 0) return 0;

    const dates = arrangements.map((arr: Arrangement) => new Date(arr.date));
    const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));

    const monthsDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1;

    return Math.round((arrangements.length / monthsDiff) * 10) / 10;
  });

  conferencesByType = computed(() => {
    const arrangements = this.arrangements();
    return {
      incoming: arrangements.filter((arr: Arrangement) => arr.type === 'incoming').length,
      outgoing: arrangements.filter((arr: Arrangement) => arr.type === 'outgoing').length,
      events: arrangements.filter((arr: Arrangement) => arr.type === 'event').length
    };
  });

  monthlyStats = computed(() => {
    const arrangements = this.arrangements();
    const monthlyCounts = new Array(12).fill(0);

    arrangements.forEach(arr => {
      const date = new Date(arr.date);
      monthlyCounts[date.getMonth()]++;
    });

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return monthNames.map((name, index) => ({
      name,
      count: monthlyCounts[index]
    }));
  });

  topSpeakers = computed(() => {
    const arrangements = this.arrangements();
    const speakers = this.speakers();
    const speakerCounts: { [key: string]: { name: string; congregation: string; count: number } } = {};

    arrangements.forEach((arr: Arrangement) => {
      if (arr.speakerId) {
        const speaker = speakers.find((s: Speaker) => s.id === arr.speakerId);
        if (speaker && speaker.id) {
          const key = speaker.id;
          if (!speakerCounts[key]) {
            speakerCounts[key] = {
              name: speaker.name,
              congregation: speaker.congregation,
              count: 0
            };
          }
          speakerCounts[key].count++;
        }
      }
    });

    return Object.values(speakerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  topTitles = computed(() => {
    const arrangements = this.arrangements();
    const titleCounts: { [key: string]: { title: string; number: number; count: number } } = {};

    arrangements.forEach((arr: Arrangement) => {
      if (arr.conferenceNumber) {
        const key = arr.conferenceNumber.toString();
        if (!titleCounts[key]) {
          titleCounts[key] = {
            title: arr.conferenceTitle,
            number: arr.conferenceNumber,
            count: 0
          };
        }
        titleCounts[key].count++;
      }
    });

    return Object.values(titleCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  weekendUtilization = computed(() => {
    const arrangements = this.arrangements();
    const totalWeekends = arrangements.length;
    const occupiedWeekends = arrangements.filter((arr: Arrangement) => arr.type === 'incoming' || arr.type === 'event').length;
    const freeWeekends = totalWeekends - occupiedWeekends;

    return {
      occupied: occupiedWeekends,
      free: freeWeekends,
      percentage: totalWeekends > 0 ? Math.round((occupiedWeekends / totalWeekends) * 100) : 0
    };
  });

  congregationStats = computed(() => {
    const arrangements = this.arrangements();
    const congCounts: { [key: string]: { name: string; count: number } } = {};

    arrangements.forEach((arr: Arrangement) => {
      if (arr.location) {
        const key = arr.location;
        if (!congCounts[key]) {
          congCounts[key] = {
            name: arr.location,
            count: 0
          };
        }
        congCounts[key].count++;
      }
    });

    return Object.values(congCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  recentActivity = computed(() => {
    const arrangements = this.arrangements();
    return arrangements
      .sort((a: Arrangement, b: Arrangement) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((arr: Arrangement) => ({
        id: arr.id,
        title: arr.conferenceTitle,
        speaker: arr.speakerName,
        date: arr.date
      }));
  });
}
