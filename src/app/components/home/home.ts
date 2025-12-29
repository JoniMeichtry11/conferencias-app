import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
export class HomeComponent implements OnInit {
  arrangements: Arrangement[] = [];
  thisWeekArrangements: Arrangement[] = [];
  futureArrangements: Arrangement[] = [];
  viewMode: 'incoming' | 'outgoing' = 'incoming';
  loading: boolean = true;

  constructor(private conferenceService: ConferenceService) {}

  ngOnInit() {
    this.loadData();
  }

  setViewMode(mode: 'incoming' | 'outgoing') {
    this.viewMode = mode;
    this.filterData();
  }

  loadData() {
    this.conferenceService.getArrangements().subscribe(all => {
      this.arrangements = all;
      this.filterData();
      this.loading = false;
    });
  }

  filterData() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the end of this week (next Saturday at 23:59:59)
    const currentDay = today.getDay();
    let daysUntilSaturday = currentDay === 6 ? 0 : (currentDay === 0 ? 6 : 6 - currentDay);
    
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + daysUntilSaturday);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Filter by type and future date
    const filtered = this.arrangements.filter(a => a.type === this.viewMode);
    
    const future = filtered.filter(a => {
      const arrDate = new Date(a.date);
      arrDate.setHours(0, 0, 0, 0);
      return arrDate >= today;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // This week's arrangements
    this.thisWeekArrangements = future.filter(a => {
      const arrDate = new Date(a.date);
      return arrDate <= endOfWeek;
    });
    
    // Future arrangements
    this.futureArrangements = future.filter(a => {
      const arrDate = new Date(a.date);
      return arrDate > endOfWeek;
    });
  }
}
