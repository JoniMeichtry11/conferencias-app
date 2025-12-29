export interface Speaker {
  id: string;
  name: string;
  congregation: string;
  phone?: string;
  isLocal: boolean;
  notes?: string;
}

export interface ConferenceTitle {
  number: number;
  title: string;
}

export interface Arrangement {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm
  type: 'incoming' | 'outgoing' | 'event';
  speakerName?: string; // Optional for events
  speakerCongregation?: string; // Optional for events
  speakerId?: string; // Optional for events (link to Speaker)
  conferenceTitle: string; // Title of the talk OR event name
  conferenceNumber?: number; // Optional for events
  songNumber?: number;
  songTitle?: string; // New: Title of the song
  location?: string; // Destination congregation (for outgoing) or specific place (for events)
  customLabel?: string; // e.g., "Asamblea Regional", "Visita SC"
  notes?: string;
  remindersSet: boolean;
}

export interface NeighborCongregation {
  id: string;
  name: string;
  town: string;
  coordinatorName: string;
  coordinatorPhone: string;
}
