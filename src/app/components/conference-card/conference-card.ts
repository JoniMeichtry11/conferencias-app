import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Arrangement } from '../../core/models/conference.models';
import { ConferenceService } from '../../core/services/conference.service';

@Component({
  selector: 'app-conference-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conference-card.html',
  styleUrl: './conference-card.scss'
})
export class ConferenceCardComponent {
  @Input() arrangement!: Arrangement;
  @Input() isNext: boolean = false;
  @Output() reminderSet = new EventEmitter<void>();

  constructor(private conferenceService: ConferenceService) {}

  addToCalendar() {
    const url = this.conferenceService.generateGoogleCalendarUrl(this.arrangement);
    window.open(url, '_blank');
    this.reminderSet.emit();
  }

  shareWhatsApp() {
    const message = this.conferenceService.generateWhatsAppMessage(this.arrangement);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}
