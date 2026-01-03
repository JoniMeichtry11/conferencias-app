import { Component, OnInit, inject, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Arrangement, Speaker, NeighborCongregation, ConferenceTitle } from '../../core/models/conference.models';
import { AdminNavbarComponent } from './components/admin-navbar';
import { AdminLoginComponent } from './components/admin-login';
import { ArrangementsTableComponent } from './components/arrangements-table';
import { SpeakersGridComponent } from './components/speakers-grid';
import { NeighborsGridComponent } from './components/neighbors-grid';
import { TitlesTableComponent } from './components/titles-table';
import { ArrangementFormComponent } from './components/arrangement-form';
import { SpeakerFormComponent } from './components/speaker-form';
import { NeighborFormComponent } from './components/neighbor-form';
import { TitleFormComponent } from './components/title-form';
import { AdminTabsComponent } from './components/admin-tabs';
import { StatisticsComponent } from './components/statistics';
import { ThemeService } from '../../core/services/theme.service';
import { ConferenceService } from '../../core/services/conference.service';
import { FormsModule } from '@angular/forms';
import { SONGS_DATA } from '../../core/data/song-data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AdminNavbarComponent,
    AdminLoginComponent,
    ArrangementsTableComponent,
    SpeakersGridComponent,
    NeighborsGridComponent,
    TitlesTableComponent,
    ArrangementFormComponent,
    SpeakerFormComponent,
    NeighborFormComponent,
    TitleFormComponent,
    AdminTabsComponent,
    StatisticsComponent
  ],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private conferenceService = inject(ConferenceService);
  private fb = inject(FormBuilder);
  public themeService = inject(ThemeService);

  private isProcessing = false;

  // Signals for Data from Firebase
  speakers = toSignal(this.conferenceService.getSpeakers(), { initialValue: [] as Speaker[] });
  neighbors = toSignal(this.conferenceService.getNeighbors(), { initialValue: [] as NeighborCongregation[] });
  titles = toSignal(this.conferenceService.getTitles(), { initialValue: [] as ConferenceTitle[] });
  private _arrangements = toSignal(this.conferenceService.getArrangements(), { initialValue: [] as Arrangement[] });

  // UI State Signals
  activeTab = signal<'arrangements' | 'statistics' | 'speakers' | 'neighbors' | 'titles'>('arrangements');
  showModal = signal(false);
  searchTerm = signal('');
  filterType = signal<'all' | 'incoming' | 'outgoing' | 'event'>('all');
  timeFilter = signal<'all' | 'upcoming' | 'past'>('all');
  sortOrder = signal<'asc' | 'desc'>('asc');
  weekendsToShow = signal(6);

  // Editing state
  editingArrangement = signal<Arrangement | null>(null);
  editingSpeaker = signal<Speaker | null>(null);
  editingNeighbor = signal<NeighborCongregation | null>(null);
  editingTitle = signal<ConferenceTitle | null>(null);

  arrangementForm: FormGroup;
  speakerForm: FormGroup;
  neighborForm: FormGroup;
  titleForm: FormGroup;

  // New Workflow Signals
  selectedCongreFilter = signal<string>('');
  arrangementType = signal<'incoming' | 'outgoing' | 'event'>('incoming');

  // Authentication Signal
  isAuthorized = signal(false);
  adminPassword = '';

  validationError = signal('');
  isSaving = signal(false);

  // Subscriptions for form logic
  private subs = new Subscription();

  constructor() {
    this.arrangementForm = this.fb.group({
      date: ['', Validators.required],
      time: ['19:30', Validators.required],
      type: ['incoming', Validators.required],
      speakerId: [''],
      conferenceNumber: [null],
      songNumber: [null],
      songTitle: [''],
      location: [''],
      customLabel: ['']
    });

    this.speakerForm = this.fb.group({
      name: ['', Validators.required],
      congregation: ['', Validators.required],
      phone: [''],
      isLocal: [false],
      notes: [''],
      repertoire: [[]]
    });

    this.neighborForm = this.fb.group({
      name: ['', Validators.required],
      town: ['', Validators.required],
      coordinatorName: ['', Validators.required],
      coordinatorPhone: ['', Validators.required]
    });

    this.titleForm = this.fb.group({
      number: [null, [Validators.required, Validators.min(1)]],
      title: ['', Validators.required]
    });

    // Check auth on load
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      this.isAuthorized.set(true);
    }
  }

  checkPassword() {
    // Definimos una clave sencilla, por defecto "admin123"
    // El usuario puede cambiarla aquí fácilmente.
    if (this.adminPassword === 'admin123') {
      this.isAuthorized.set(true);
      localStorage.setItem('admin_auth', 'true');
      this.validationError.set('');
    } else {
      this.validationError.set('Contraseña incorrecta');
    }
  }

  logout() {
    this.isAuthorized.set(false);
    localStorage.removeItem('admin_auth');
  }

  ngOnInit() {
    // Watch for song number changes
    this.subs.add(this.arrangementForm.get('songNumber')?.valueChanges.subscribe(num => {
      if (num && SONGS_DATA[num]) {
        this.arrangementForm.patchValue({ songTitle: SONGS_DATA[num] }, { emitEvent: false });
      }
    }));

    // Watch for type changes to validate required fields
    this.subs.add(this.arrangementForm.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
      this.arrangementType.set(type);
    }));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  updateValidators(type: string) {
    const speakerCtrl = this.arrangementForm.get('speakerId');
    const confNumCtrl = this.arrangementForm.get('conferenceNumber');
    const labelCtrl = this.arrangementForm.get('customLabel');

    if (type === 'event') {
      speakerCtrl?.clearValidators();
      confNumCtrl?.clearValidators();
      labelCtrl?.setValidators(Validators.required);
    } else {
      speakerCtrl?.setValidators(Validators.required);
      confNumCtrl?.setValidators(Validators.required);
      labelCtrl?.clearValidators();
    }
    speakerCtrl?.updateValueAndValidity();
    confNumCtrl?.updateValueAndValidity();
    labelCtrl?.updateValueAndValidity();
  }

  // Computed Properties

  filteredArrangements = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const type = this.filterType();
    const time = this.timeFilter();
    const sort = this.sortOrder();
    const today = new Date().toISOString().split('T')[0];

    let filtered = this._arrangements().filter(arr => {
      const matchesSearch = !search ||
        arr.speakerName?.toLowerCase().includes(search) ||
        arr.conferenceTitle.toLowerCase().includes(search) ||
        arr.speakerCongregation?.toLowerCase().includes(search);

      const matchesType = type === 'all' || arr.type === type;

      const matchesTime = time === 'all' ||
        (time === 'upcoming' && arr.date >= today) ||
        (time === 'past' && arr.date < today);

      return matchesSearch && matchesType && matchesTime;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sort === 'asc' ? dateA - dateB : dateB - dateA;
    });
  });

  freeWeekends = computed(() => {
    const arrangements = this._arrangements();
    const freeWeekends: Date[] = [];
    const today = new Date();

    // Buscar los próximos 12 fines de semana
    for (let i = 0; i < 12; i++) {
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + (6 - today.getDay() + 7 * i)); // Próximo sábado

      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1); // Domingo siguiente

      // Verificar si hay arreglos en sábado o domingo
      const hasArrangement = arrangements.some(arr => {
        const arrDate = new Date(arr.date);
        return arrDate.toDateString() === saturday.toDateString() ||
               arrDate.toDateString() === sunday.toDateString();
      });

      if (!hasArrangement) {
        freeWeekends.push(new Date(saturday));
      }
    }

    return freeWeekends.slice(0, 6); // Mostrar solo los próximos 6
  });

  upcomingWeekends = computed(() => {
    const arrangements = this._arrangements();
    const weekends: { saturday: Date; sunday: Date; hasArrangement: boolean; arrangements: Arrangement[] }[] = [];
    const today = new Date();

    // Buscar los próximos fines de semana según el límite configurado
    for (let i = 0; i < this.weekendsToShow(); i++) {
      const saturday = new Date(today);
      saturday.setDate(today.getDate() + (6 - today.getDay() + 7 * i)); // Próximo sábado

      const sunday = new Date(saturday);
      sunday.setDate(saturday.getDate() + 1); // Domingo siguiente

      // Calcular el inicio y fin de la semana (lunes a domingo)
      const weekStart = new Date(saturday);
      weekStart.setDate(saturday.getDate() - 5); // Lunes de esa semana
      const weekEnd = new Date(sunday); // Domingo

      // Encontrar arreglos para esta semana completa (lunes-domingo)
      const weekendArrangements = arrangements.filter(arr => {
        const arrDate = new Date(arr.date);
        return arrDate >= weekStart && arrDate <= weekEnd;
      });

      // Si hay una visita o evento, la semana está cubierta
      // Las salidas no cubren la congregación local
      const hasEvent = weekendArrangements.some(arr => arr.type === 'event');
      const hasIncoming = weekendArrangements.some(arr => arr.type === 'incoming');

      weekends.push({
        saturday: new Date(saturday),
        sunday: new Date(sunday),
        hasArrangement: hasEvent || hasIncoming,
        arrangements: weekendArrangements
      });
    }

    return weekends;
  });

  // Filtered speakers based on congregation selection
  availableSpeakers = computed(() => {
    const congreName = this.selectedCongreFilter();
    const type = this.arrangementType();

    if (type === 'outgoing') {
      // Para salidas, solo mostramos oradores locales
      return this.speakers().filter(s => s.isLocal);
    } else {
      // Para visitas, filtramos por congregación si se seleccionó una
      return this.speakers().filter(s => {
        const matchesCongre = !congreName || s.congregation === congreName;
        return matchesCongre;
      });
    }
  });

  onCongreFilterChange(congre: string) {
    this.selectedCongreFilter.set(congre);
    if (this.arrangementType() === 'outgoing' && congre) {
      this.arrangementForm.patchValue({ location: congre });
    }
  }

  // --- Navigation ---

  setTab(tab: any) {
    this.activeTab.set(tab as 'arrangements' | 'speakers' | 'neighbors' | 'titles');
  }

  setFilterType(type: any) {
    this.filterType.set(type as 'all' | 'incoming' | 'outgoing' | 'event');
  }

  setTimeFilter(time: any) {
    this.timeFilter.set(time as 'all' | 'upcoming' | 'past');
  }

  setSortOrder(order: any) {
    this.sortOrder.set(order as 'asc' | 'desc');
  }

  // --- Arrangement Sync ---

  openAddModal() {
    this.editingArrangement.set(null);
    this.selectedCongreFilter.set('');
    this.arrangementType.set('incoming');
    this.arrangementForm.reset({
      date: '',
      time: '19:30',
      type: 'incoming',
      songNumber: null
    });
    this.updateValidators('incoming');
    this.showModal.set(true);
    this.validationError.set('');
  }

  editArrangement(arr: Arrangement) {
    this.editingArrangement.set(arr);
    // For outgoing arrangements, set filter to destination congregation
    // For incoming, set to speaker's congregation to filter speakers
    const filterValue = arr.type === 'outgoing' ? arr.location || '' : (arr.speakerId ? this.speakers().find(s => s.id === arr.speakerId)?.congregation || '' : '');
    this.selectedCongreFilter.set(filterValue);
    this.arrangementType.set(arr.type);
    this.arrangementForm.patchValue({
      date: arr.date,
      time: arr.time,
      type: arr.type,
      speakerId: arr.speakerId || '',
      conferenceNumber: arr.conferenceNumber,
      songNumber: arr.songNumber,
      songTitle: arr.songTitle,
      location: arr.location,
      customLabel: arr.customLabel
    });
    this.updateValidators(arr.type);
    this.showModal.set(true);
    this.validationError.set('');
  }

  async saveArrangement() {
    if (this.isProcessing || this.arrangementForm.invalid || this.isSaving()) {
      if (this.arrangementForm.invalid) this.validationError.set('Por favor completa todos los campos requeridos');
      return;
    }

    this.isProcessing = true;
    this.isSaving.set(true);

    const formVal = this.arrangementForm.getRawValue();
    const speaker = this.speakers().find(s => s.id === formVal.speakerId);

    // Ensure we handle conferenceNumber as a number for strict comparison
    const talkNum = formVal.conferenceNumber ? Number(formVal.conferenceNumber) : null;
    const title = this.titles().find(t => t.number === talkNum);

    const arrangementData: any = {
      date: formVal.date,
      time: formVal.time,
      type: formVal.type,
      speakerId: formVal.speakerId || null,
      speakerName: formVal.type === 'event' ? '' : speaker?.name || '',
      speakerCongregation: formVal.type === 'event' ? '' : speaker?.congregation || '',
      conferenceTitle: formVal.type === 'event' ? formVal.customLabel : (title?.title || ''),
      conferenceNumber: talkNum,
      songNumber: formVal.songNumber || null,
      songTitle: formVal.songTitle || '',
      location: formVal.location || '',
      customLabel: formVal.customLabel || '',
      remindersSet: this.editingArrangement()?.remindersSet || false
    };

    try {
      const editing = this.editingArrangement();
      if (editing) {
        await firstValueFrom(this.conferenceService.updateArrangement({ ...arrangementData, id: editing.id }));
      } else {
        await firstValueFrom(this.conferenceService.addArrangement(arrangementData));
      }
      this.showModal.set(false);
    } catch (err) {
      this.validationError.set('Error al guardar en la base de datos');
    } finally {
      this.isSaving.set(false);
      this.isProcessing = false;
    }
  }

  async deleteArrangement(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este arreglo?')) {
      await firstValueFrom(this.conferenceService.deleteArrangement(id));
    }
  }

  // --- Speaker Sync ---

  openAddSpeaker() {
    this.editingSpeaker.set(null);
    this.speakerForm.reset({ isLocal: false, repertoire: [] });
    this.showModal.set(true);
    this.validationError.set('');
  }

  editSpeaker(s: Speaker) {
    this.editingSpeaker.set(s);
    this.speakerForm.patchValue(s);
    this.showModal.set(true);
    this.validationError.set('');
  }

  async saveSpeaker() {
    if (this.isProcessing || this.speakerForm.invalid || this.isSaving()) return;
    this.isProcessing = true;
    this.isSaving.set(true);
    const data = this.speakerForm.value;
    try {
      const editing = this.editingSpeaker();
      if (editing) {
        await firstValueFrom(this.conferenceService.updateSpeaker({ ...data, id: editing.id }));
      } else {
        await firstValueFrom(this.conferenceService.addSpeaker(data));
      }
      this.showModal.set(false);
    } catch (err) {
      this.validationError.set('Error al guardar orador');
    } finally {
      this.isSaving.set(false);
      this.isProcessing = false;
    }
  }

  async deleteSpeaker(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Eliminar orador?')) {
      await firstValueFrom(this.conferenceService.deleteSpeaker(id));
    }
  }

  // --- Neighbor Sync ---

  openAddNeighbor() {
    this.editingNeighbor.set(null);
    this.neighborForm.reset();
    this.showModal.set(true);
    this.validationError.set('');
  }

  editNeighbor(n: NeighborCongregation) {
    this.editingNeighbor.set(n);
    this.neighborForm.patchValue(n);
    this.showModal.set(true);
    this.validationError.set('');
  }

  async saveNeighbor() {
    if (this.isProcessing || this.neighborForm.invalid || this.isSaving()) return;
    this.isProcessing = true;
    this.isSaving.set(true);
    const data = this.neighborForm.value;
    try {
      const editing = this.editingNeighbor();
      if (editing) {
        await firstValueFrom(this.conferenceService.updateNeighbor({ ...data, id: editing.id }));
      } else {
        await firstValueFrom(this.conferenceService.addNeighbor(data));
      }
      this.showModal.set(false);
    } catch (err) {
      this.validationError.set('Error al guardar congregación');
    } finally {
      this.isSaving.set(false);
      this.isProcessing = false;
    }
  }

  async deleteNeighbor(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Eliminar congregación?')) {
      await firstValueFrom(this.conferenceService.deleteNeighbor(id));
    }
  }

  // --- Title Sync ---

  openAddTitle() {
    this.editingTitle.set(null);
    this.titleForm.reset();
    this.showModal.set(true);
    this.validationError.set('');
  }

  editTitle(t: ConferenceTitle) {
    this.editingTitle.set(t);
    this.titleForm.patchValue(t);
    this.showModal.set(true);
    this.validationError.set('');
  }

  async saveTitle() {
    if (this.isProcessing || this.titleForm.invalid || this.isSaving()) return;
    this.isProcessing = true;
    this.isSaving.set(true);
    const data = this.titleForm.value;
    try {
      await firstValueFrom(this.conferenceService.saveTitle(data));
      this.showModal.set(false);
    } catch (err) {
      this.validationError.set('Error al guardar tema');
    } finally {
      this.isSaving.set(false);
      this.isProcessing = false;
    }
  }

  // --- Helpers ---

  toggleSort() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
  }

  shareWhatsApp(arr: Arrangement) {
    const msg = this.conferenceService.generateWhatsAppMessage(arr);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  // Repertoire multi-select helper
  toggleRepertoire(num: number) {
    const repertoire = this.speakerForm.get('repertoire')?.value as number[];
    if (repertoire.includes(num)) {
      this.speakerForm.patchValue({ repertoire: repertoire.filter(n => n !== num) });
    } else {
      this.speakerForm.patchValue({ repertoire: [...repertoire, num] });
    }
  }

  isTitleInRepertoire(num: number): boolean {
    return (this.speakerForm.get('repertoire')?.value as number[])?.includes(num);
  }

  getSelectedSpeakerRepertoire(): number[] {
    const speakerId = this.arrangementForm.get('speakerId')?.value;
    const speaker = this.speakers().find(s => s.id === speakerId);
    return speaker?.repertoire || [];
  }

  getSelectedSpeakerTitles(): ConferenceTitle[] {
    const repertoire = this.getSelectedSpeakerRepertoire();
    return this.titles().filter(t => repertoire.includes(t.number));
  }

  createArrangementForWeekend(saturday: Date) {
    this.editingArrangement.set(null);
    this.selectedCongreFilter.set('');
    this.arrangementType.set('incoming');

    // Dejar la fecha vacía para que el usuario elija el día específico (sábado o domingo)
    this.arrangementForm.reset({
      date: '',
      time: '19:30',
      type: 'incoming',
      songNumber: null
    });
    this.updateValidators('incoming');
    this.showModal.set(true);
    this.validationError.set('');
  }

  loadMoreWeekends() {
    this.weekendsToShow.update(current => current + 6);
  }

  getIncomingArrangement(arrs: Arrangement[]): Arrangement | undefined {
    return arrs.find(a => a.type === 'incoming' || a.type === 'event');
  }

  getOutgoingArrangement(arrs: Arrangement[]): Arrangement | undefined {
    return arrs.find(a => a.type === 'outgoing' || a.type === 'event');
  }

  createOutgoingForWeekend(saturday: Date) {
    this.editingArrangement.set(null);
    this.selectedCongreFilter.set('');
    this.arrangementType.set('outgoing');

    this.arrangementForm.reset({
      date: '',
      time: '19:30',
      type: 'outgoing',
      songNumber: null
    });
    this.updateValidators('outgoing');
    this.showModal.set(true);
    this.validationError.set('');
  }
}
