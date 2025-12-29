import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Arrangement, Speaker, NeighborCongregation, ConferenceTitle } from '../models/conference.models';
import { MOCK_ARRANGEMENTS, MOCK_SPEAKERS, MOCK_NEIGHBORS, MOCK_TITLES } from '../mocks/conference.mocks';
import { SONGS_DATA } from '../data/song-data';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {

  constructor() { }

  getArrangements(): Observable<Arrangement[]> {
    return of(MOCK_ARRANGEMENTS).pipe(
      map(arrangements => 
        arrangements.map(arr => ({
          ...arr,
          songTitle: arr.songNumber && SONGS_DATA[arr.songNumber] 
            ? SONGS_DATA[arr.songNumber] 
            : arr.songTitle
        }))
      )
    );
  }

  getSpeakers(): Observable<Speaker[]> {
    return of(MOCK_SPEAKERS);
  }

  getNeighbors(): Observable<NeighborCongregation[]> {
    return of(MOCK_NEIGHBORS);
  }

  getNextWeekendArrangement(): Observable<Arrangement | undefined> {
    const today = new Date();
    // Sort arrangements by date and find the first one that is >= today
    const sorted = [...MOCK_ARRANGEMENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const next = sorted.find(a => new Date(a.date) >= today && a.type === 'incoming');
    return of(next ? {
      ...next,
      songTitle: next.songNumber && SONGS_DATA[next.songNumber] 
        ? SONGS_DATA[next.songNumber] 
        : next.songTitle
    } : undefined);
  }

  getOutgoingArrangements(): Observable<Arrangement[]> {
    return of(MOCK_ARRANGEMENTS.filter(a => a.type === 'outgoing')).pipe(
      map(arrangements => 
        arrangements.map(arr => ({
          ...arr,
          songTitle: arr.songNumber && SONGS_DATA[arr.songNumber] 
            ? SONGS_DATA[arr.songNumber] 
            : arr.songTitle
        }))
      )
    );
  }

  // Google Calendar Integration helper
  generateGoogleCalendarUrl(arrangement: Arrangement): string {
    const start = new Date(arrangement.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(arrangement.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const songInfo = arrangement.songNumber ? `\n🎵 Cántico: ${arrangement.songNumber}` : '';
    const details = `Discurso: ${arrangement.conferenceTitle} (#${arrangement.conferenceNumber})${songInfo}\nOrador: ${arrangement.speakerName} (${arrangement.speakerCongregation})`;
    const location = arrangement.location;
    const title = `Conferencia Pública: ${arrangement.speakerName}`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location || '')}`;
  }

  // WhatsApp helper
  generateWhatsAppMessage(arrangement: Arrangement): string {
    const songInfo = arrangement.songNumber ? `\n🎵 Cántico: ${arrangement.songNumber}` : '';
    return `Hola, te comparto los datos de la conferencia:\n\n📅 Fecha: ${new Date(arrangement.date).toLocaleDateString()}\n🕒 Hora: ${arrangement.time}\n🎤 Orador: ${arrangement.speakerName}\n🏛 Congr: ${arrangement.speakerCongregation}\n📚 Tema: ${arrangement.conferenceTitle} (#${arrangement.conferenceNumber})${songInfo}\n📍 Lugar: ${arrangement.location}`;
  }

  // Validation Rules
  canSpeakerGoOut(speakerId: string, date: Date): boolean {
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Check if the speaker has any outgoing arrangements in the same month and year
    const outgoingInMonth = MOCK_ARRANGEMENTS.filter(a => 
      a.speakerId === speakerId && 
      a.type === 'outgoing' &&
      new Date(a.date).getMonth() === month &&
      new Date(a.date).getFullYear() === year
    );
    
    return outgoingInMonth.length === 0;
  }

  canConferenceBeGiven(titleNumber: number, date: Date, excludeId?: string): boolean {
    const sixMonthsAgo = new Date(date);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Check if this conference title was given in the last 6 months (incoming only)
    const recentConferences = MOCK_ARRANGEMENTS.filter(a => 
      a.id !== excludeId &&
      a.conferenceNumber === titleNumber &&
      a.type === 'incoming' &&
      new Date(a.date) >= sixMonthsAgo &&
      new Date(a.date) < date
    );
    
    return recentConferences.length === 0;
  }

  // CRUD Operations (Mocked)
  addArrangement(arrangement: Arrangement): Observable<Arrangement> {
    const enriched = {
      ...arrangement,
      songTitle: arrangement.songNumber && SONGS_DATA[arrangement.songNumber] 
        ? SONGS_DATA[arrangement.songNumber] 
        : arrangement.songTitle
    };
    MOCK_ARRANGEMENTS.push(enriched);
    return of(enriched);
  }

  updateArrangement(arrangement: Arrangement): Observable<Arrangement> {
    const index = MOCK_ARRANGEMENTS.findIndex(a => a.id === arrangement.id);
    const enriched = {
      ...arrangement,
      songTitle: arrangement.songNumber && SONGS_DATA[arrangement.songNumber] 
        ? SONGS_DATA[arrangement.songNumber] 
        : arrangement.songTitle
    };
    if (index !== -1) {
      MOCK_ARRANGEMENTS[index] = enriched;
    }
    return of(enriched);
  }

  deleteArrangement(id: string): Observable<boolean> {
    const index = MOCK_ARRANGEMENTS.findIndex(a => a.id === id);
    if (index !== -1) {
      MOCK_ARRANGEMENTS.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getTitles(): Observable<ConferenceTitle[]> {
    return of(MOCK_TITLES);
  }
}
