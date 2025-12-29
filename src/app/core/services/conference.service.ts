import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  setDoc,
  CollectionReference
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, combineLatest, of } from 'rxjs';
import { Arrangement, Speaker, NeighborCongregation, ConferenceTitle } from '../models/conference.models';
import { SONGS_DATA } from '../data/song-data';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private firestore: Firestore = inject(Firestore);

  // Collections with proper typing
  private arrangementsColl!: CollectionReference<Arrangement>;
  private speakersColl!: CollectionReference<Speaker>;
  private neighborsColl!: CollectionReference<NeighborCongregation>;
  private titlesColl!: CollectionReference<ConferenceTitle>;

  constructor() {
    this.arrangementsColl = collection(this.firestore, 'arrangements') as CollectionReference<Arrangement>;
    this.speakersColl = collection(this.firestore, 'speakers') as CollectionReference<Speaker>;
    this.neighborsColl = collection(this.firestore, 'neighbors') as CollectionReference<NeighborCongregation>;
    this.titlesColl = collection(this.firestore, 'titles') as CollectionReference<ConferenceTitle>;
  }

  // --- Arrangements ---

  getArrangements(): Observable<Arrangement[]> {
    const q = query(this.arrangementsColl, orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  getNextWeekendArrangement(): Observable<Arrangement | undefined> {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      this.arrangementsColl, 
      where('date', '>=', today), 
      where('type', '==', 'incoming'),
      orderBy('date', 'asc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map(arrangements => arrangements[0])
    );
  }

  getOutgoingArrangements(): Observable<Arrangement[]> {
    const q = query(this.arrangementsColl, where('type', '==', 'outgoing'), orderBy('date', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  addArrangement(arrangement: Omit<Arrangement, 'id'>): Observable<string> {
    const songTitle = (arrangement.songNumber && SONGS_DATA[arrangement.songNumber]) || arrangement.songTitle || '';
    const data = { ...arrangement, songTitle };
    return from(addDoc(this.arrangementsColl, data)).pipe(map(docRef => docRef.id));
  }

  updateArrangement(arrangement: Arrangement): Observable<void> {
    const { id, ...data } = arrangement;
    if (!id) throw new Error('ID required for update');
    const songTitle = (data.songNumber && SONGS_DATA[data.songNumber]) || data.songTitle || '';
    const docRef = doc(this.firestore, `arrangements/${id}`);
    return from(updateDoc(docRef, { ...data, songTitle }));
  }

  deleteArrangement(id: string): Observable<void> {
    const docRef = doc(this.firestore, `arrangements/${id}`);
    return from(deleteDoc(docRef));
  }

  // --- Speakers ---

  getSpeakers(): Observable<Speaker[]> {
    const q = query(this.speakersColl, orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  addSpeaker(speaker: Omit<Speaker, 'id'>): Observable<string> {
    return from(addDoc(this.speakersColl, speaker)).pipe(map(docRef => docRef.id));
  }

  updateSpeaker(speaker: Speaker): Observable<void> {
    const { id, ...data } = speaker;
    if (!id) throw new Error('ID required for update');
    const docRef = doc(this.firestore, `speakers/${id}`);
    return from(updateDoc(docRef, { ...data }));
  }

  deleteSpeaker(id: string): Observable<void> {
    const docRef = doc(this.firestore, `speakers/${id}`);
    return from(deleteDoc(docRef));
  }

  // --- Neighbors ---

  getNeighbors(): Observable<NeighborCongregation[]> {
    const q = query(this.neighborsColl, orderBy('name', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  addNeighbor(neighbor: Omit<NeighborCongregation, 'id'>): Observable<string> {
    return from(addDoc(this.neighborsColl, neighbor)).pipe(map(docRef => docRef.id));
  }

  updateNeighbor(neighbor: NeighborCongregation): Observable<void> {
    const { id, ...data } = neighbor;
    if (!id) throw new Error('ID required for update');
    const docRef = doc(this.firestore, `neighbors/${id}`);
    return from(updateDoc(docRef, { ...data }));
  }

  deleteNeighbor(id: string): Observable<void> {
    const docRef = doc(this.firestore, `neighbors/${id}`);
    return from(deleteDoc(docRef));
  }

  // --- Titles ---

  getTitles(): Observable<ConferenceTitle[]> {
    const q = query(this.titlesColl, orderBy('number', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  saveTitle(title: ConferenceTitle): Observable<void> {
    const docRef = doc(this.firestore, `titles/${title.number}`);
    return from(setDoc(docRef, title));
  }

  // --- Helpers ---

  generateGoogleCalendarUrl(arrangement: Arrangement): string {
    const start = new Date(arrangement.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(arrangement.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const songInfo = arrangement.songNumber ? `\n🎵 Cántico: ${arrangement.songNumber}` : '';
    const details = `Discurso: ${arrangement.conferenceTitle} (#${arrangement.conferenceNumber})${songInfo}\nOrador: ${arrangement.speakerName} (${arrangement.speakerCongregation})`;
    const location = arrangement.location;
    const title = `Conferencia Pública: ${arrangement.speakerName}`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location || '')}`;
  }

  generateWhatsAppMessage(arrangement: Arrangement): string {
    const songInfo = arrangement.songNumber ? `\n🎵 Cántico: ${arrangement.songNumber}` : '';
    return `Hola, te comparto los datos de la conferencia:\n\n📅 Fecha: ${new Date(arrangement.date).toLocaleDateString()}\n🕒 Hora: ${arrangement.time}\n🎤 Orador: ${arrangement.speakerName}\n🏛 Congr: ${arrangement.speakerCongregation}\n📚 Tema: ${arrangement.conferenceTitle} (#${arrangement.conferenceNumber})${songInfo}\n📍 Lugar: ${arrangement.location}`;
  }
}
