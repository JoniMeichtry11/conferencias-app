import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Arrangement } from '../../core/models/conference.models';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';
import { ThemeService } from '../../core/services/theme.service';
import { SONGS_DATA } from '../../core/data/song-data';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ThemeToggleComponent, RouterModule, DatePipe],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent {
  arrangements: Arrangement[] = [];
  speakers = [
    { id: '1', name: 'Juan Perez', congregation: 'Central' },
    { id: '2', name: 'Carlos Gomez', congregation: 'Norte' },
    { id: '3', name: 'Miguel Angel', congregation: 'Sur' }
  ];
  titles = [
    { number: 1, title: '¿Qué es el Reino de Dios?' },
    { number: 5, title: 'La verdadera felicidad' },
    { number: 7, title: 'La Biblia: ¿Mito o realidad?' }
  ];

  activeTab: 'arrangements' | 'speakers' | 'neighbors' = 'arrangements';
  showModal = false;
  editingArrangement: Arrangement | null = null;
  arrangementForm: FormGroup;
  validationError: string = '';

  // Filtering and Sorting state
  searchTerm: string = '';
  filterType: 'all' | 'incoming' | 'outgoing' | 'event' = 'all';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private fb: FormBuilder, public themeService: ThemeService) {
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

    // Mock data
    this.arrangements = [
      {
        id: '1',
        date: '2024-10-26',
        time: '19:30',
        type: 'incoming',
        speakerName: 'Juan Perez',
        speakerCongregation: 'Central',
        speakerId: '1',
        conferenceTitle: '¿Qué es el Reino de Dios?',
        conferenceNumber: 1,
        songNumber: 12,
        songTitle: 'La promesa de vida eterna',
        remindersSet: false
      },
      {
        id: '2',
        date: '2024-11-02',
        time: '10:00',
        type: 'outgoing',
        speakerName: 'Carlos Gomez',
        speakerCongregation: 'Norte',
        speakerId: '2',
        conferenceTitle: 'La verdadera felicidad',
        conferenceNumber: 5,
        songNumber: 135,
        location: 'Wheelwright',
        remindersSet: false
      }
    ];

    // Watch for song number changes
    this.arrangementForm.get('songNumber')?.valueChanges.subscribe(num => {
      if (num && SONGS_DATA[num]) {
        this.arrangementForm.patchValue({ songTitle: SONGS_DATA[num] }, { emitEvent: false });
      }
    });

    // Watch for type changes to validate required fields
    this.arrangementForm.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  updateValidators(type: string) {
    const speakerCtrl = this.arrangementForm.get('speakerId');
    const confNumCtrl = this.arrangementForm.get('conferenceNumber');
    const labelCtrl = this.arrangementForm.get('customLabel');

    if (type === 'event') {
      speakerCtrl?.clearValidators();
      confNumCtrl?.clearValidators();
      labelCtrl?.setValidators(Validators.required); // Custom label required for events
    } else {
      speakerCtrl?.setValidators(Validators.required);
      confNumCtrl?.setValidators(Validators.required);
      labelCtrl?.clearValidators();
    }
    speakerCtrl?.updateValueAndValidity();
    confNumCtrl?.updateValueAndValidity();
    labelCtrl?.updateValueAndValidity();
  }

  openAddModal() {
    this.editingArrangement = null;
    this.arrangementForm.reset({ 
      date: '', 
      time: '19:30', 
      type: 'incoming',
      songNumber: null 
    });
    this.updateValidators('incoming');
    this.showModal = true;
    this.validationError = '';
  }

  editArrangement(arr: Arrangement) {
    this.editingArrangement = arr;
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
    this.showModal = true;
    this.validationError = '';
  }

  deleteArrangement(id: string) {
    if (confirm('¿Estás seguro de eliminar este arreglo?')) {
      this.arrangements = this.arrangements.filter(a => a.id !== id);
    }
  }

  saveArrangement() {
    if (this.arrangementForm.invalid) {
      this.validationError = 'Por favor completa todos los campos requeridos';
      return;
    }

    const formVal = this.arrangementForm.value;
    // For manual title entry override if needed
    const songTitle = formVal.songTitle || (formVal.songNumber ? SONGS_DATA[formVal.songNumber] : '');

    let newArr: Arrangement = {
      id: this.editingArrangement ? this.editingArrangement.id : Date.now().toString(),
      date: formVal.date,
      time: formVal.time,
      type: formVal.type,
      speakerId: formVal.speakerId,
      speakerName: formVal.type === 'event' ? '' : this.speakers.find(s => s.id === formVal.speakerId)?.name || '',
      speakerCongregation: formVal.type === 'event' ? '' : this.speakers.find(s => s.id === formVal.speakerId)?.congregation || '',
      conferenceTitle: formVal.type === 'event' ? formVal.customLabel : (this.titles.find(t => t.number === formVal.conferenceNumber)?.title || ''),
      conferenceNumber: formVal.conferenceNumber,
      songNumber: formVal.songNumber,
      songTitle: songTitle,
      location: formVal.location,
      customLabel: formVal.customLabel,
      remindersSet: false
    };

    if (this.editingArrangement) {
      const index = this.arrangements.findIndex(a => a.id === this.editingArrangement!.id);
      this.arrangements[index] = newArr;
    } else {
      this.arrangements.push(newArr);
    }
    
    // Sort by date
    this.arrangements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.showModal = false;
  }

  get filteredArrangements(): Arrangement[] {
    let filtered = this.arrangements.filter(arr => {
      const matchesSearch = !this.searchTerm || 
        arr.speakerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        arr.conferenceTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        arr.speakerCongregation?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = this.filterType === 'all' || arr.type === this.filterType;
      
      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  toggleSort() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  shareWhatsApp(arr: Arrangement) {
    // Implementation
  }
}
