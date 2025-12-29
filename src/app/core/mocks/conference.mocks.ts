import { Arrangement, Speaker, NeighborCongregation, ConferenceTitle } from '../models/conference.models';

export const MOCK_TITLES: ConferenceTitle[] = [
  { number: 1, title: "¿Conoce usted a Dios?" },
  { number: 2, title: "Amigos de Dios o amigos del mundo" },
  { number: 3, title: "Sirva a Dios con alegría" },
  { number: 4, title: "La felicidad verdadera" },
  { number: 5, title: "¿Por qué permite Dios el sufrimiento?" },
  { number: 6, title: "La resurrección: ¿mito o realidad?" },
  { number: 7, title: "Cómo encontrar el camino a la vida" },
  { number: 8, title: "¿Quién es Jesucristo?" },
  { number: 9, title: "La esperanza de un paraíso" },
  { number: 10, title: "La Biblia: ¿un libro para el hombre moderno?" },
  { number: 11, title: "Cómo tener una familia feliz" },
  { number: 12, title: "¿Es la muerte el fin?" },
  { number: 50, title: "La verdad sobre el infierno" },
  { number: 100, title: "Un nuevo mundo bajo la dirección de Cristo" }
];

export const MOCK_SPEAKERS: Speaker[] = [
  { id: 's1', name: 'Juan Pérez', congregation: 'Wheelwright', isLocal: true, phone: '2473456789' },
  { id: 's2', name: 'Diego Rossi', congregation: 'Wheelwright', isLocal: true, phone: '2473112233' },
  { id: 's3', name: 'Carlos López', congregation: 'Hughes', isLocal: false },
  { id: 's4', name: 'Martín García', congregation: 'Colón', isLocal: false },
  { id: 's5', name: 'Roberto Silva', congregation: 'Wheelwright', isLocal: true, phone: '2473556677' },
  { id: 's6', name: 'Miguel Fernández', congregation: 'Hughes', isLocal: false },
  { id: 's7', name: 'Andrés Martínez', congregation: 'Colón', isLocal: false },
  { id: 's8', name: 'José González', congregation: 'Wheelwright', isLocal: true, phone: '2473667788' }
];

export const MOCK_NEIGHBORS: NeighborCongregation[] = [
  { id: 'n1', name: 'Hughes', town: 'Hughes', coordinatorName: 'Roberto Gómez', coordinatorPhone: '2473998877' },
  { id: 'n2', name: 'Colón', town: 'Colón', coordinatorName: 'Samuel Sosa', coordinatorPhone: '2475443322' }
];

// Helper function to get next Saturday at 19:30
function getSaturdayDate(weekOffset: number = 0): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  // Calculate days until next Saturday
  let daysUntilSaturday: number;
  if (currentDay === 6) { // Today is Saturday
    daysUntilSaturday = weekOffset === 0 ? 0 : 7 * weekOffset;
  } else if (currentDay === 0) { // Today is Sunday
    daysUntilSaturday = 6 + (7 * weekOffset);
  } else { // Monday to Friday
    daysUntilSaturday = (6 - currentDay) + (7 * weekOffset);
  }
  const targetSaturday = new Date(today);
  targetSaturday.setDate(today.getDate() + daysUntilSaturday);
  targetSaturday.setHours(19, 30, 0, 0);
  return targetSaturday.toISOString();
}

export const MOCK_ARRANGEMENTS: Arrangement[] = [
  // Esta semana (Semana 0)
  {
    id: 'a1',
    date: getSaturdayDate(0),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's3',
    speakerName: 'Carlos López',
    speakerCongregation: 'Hughes',
    conferenceTitle: '¿Conoce usted a Dios?',
    conferenceNumber: 1,
    songNumber: 15,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a2',
    date: getSaturdayDate(0),
    time: '19:30',
    location: 'Hughes',
    speakerId: 's1',
    speakerName: 'Juan Pérez',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'Sirva a Dios con alegría',
    conferenceNumber: 3,
    songNumber: 22,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 1
  {
    id: 'a3',
    date: getSaturdayDate(1),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's4',
    speakerName: 'Martín García',
    speakerCongregation: 'Colón',
    conferenceTitle: 'Un nuevo mundo bajo la dirección de Cristo',
    conferenceNumber: 100,
    songNumber: 30,
    type: 'incoming',
    remindersSet: true
  },
  {
    id: 'a4',
    date: getSaturdayDate(1),
    time: '19:30',
    location: 'Colón',
    speakerId: 's2',
    speakerName: 'Diego Rossi',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'La felicidad verdadera',
    conferenceNumber: 4,
    songNumber: 12,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 2
  {
    id: 'a5',
    date: getSaturdayDate(2),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's6',
    speakerName: 'Miguel Fernández',
    speakerCongregation: 'Hughes',
    conferenceTitle: '¿Por qué permite Dios el sufrimiento?',
    conferenceNumber: 5,
    songNumber: 25,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a6',
    date: getSaturdayDate(2),
    time: '19:30',
    location: 'Hughes',
    speakerId: 's5',
    speakerName: 'Roberto Silva',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'La resurrección: ¿mito o realidad?',
    conferenceNumber: 6,
    songNumber: 18,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 3
  {
    id: 'a7',
    date: getSaturdayDate(3),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's7',
    speakerName: 'Andrés Martínez',
    speakerCongregation: 'Colón',
    conferenceTitle: 'Cómo encontrar el camino a la vida',
    conferenceNumber: 7,
    songNumber: 8,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a8',
    date: getSaturdayDate(3),
    time: '19:30',
    location: 'Colón',
    speakerId: 's8',
    speakerName: 'José González',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: '¿Quién es Jesucristo?',
    conferenceNumber: 8,
    songNumber: 35,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 4
  {
    id: 'a9',
    date: getSaturdayDate(4),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's3',
    speakerName: 'Carlos López',
    speakerCongregation: 'Hughes',
    conferenceTitle: 'La esperanza de un paraíso',
    conferenceNumber: 9,
    songNumber: 42,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a10',
    date: getSaturdayDate(4),
    time: '19:30',
    location: 'Hughes',
    speakerId: 's1',
    speakerName: 'Juan Pérez',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'La Biblia: ¿un libro para el hombre moderno?',
    conferenceNumber: 10,
    songNumber: 28,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 5
  {
    id: 'a11',
    date: getSaturdayDate(5),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's4',
    speakerName: 'Martín García',
    speakerCongregation: 'Colón',
    conferenceTitle: 'Cómo tener una familia feliz',
    conferenceNumber: 11,
    songNumber: 33,
    type: 'incoming',
    remindersSet: false
  },
  // Semana 6
  {
    id: 'a12',
    date: getSaturdayDate(6),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's6',
    speakerName: 'Miguel Fernández',
    speakerCongregation: 'Hughes',
    conferenceTitle: '¿Es la muerte el fin?',
    conferenceNumber: 12,
    songNumber: 16,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a13',
    date: getSaturdayDate(6),
    time: '19:30',
    location: 'Hughes',
    speakerId: 's2',
    speakerName: 'Diego Rossi',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'La verdad sobre el infierno',
    conferenceNumber: 50,
    songNumber: 40,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 8
  {
    id: 'a14',
    date: getSaturdayDate(8),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's7',
    speakerName: 'Andrés Martínez',
    speakerCongregation: 'Colón',
    conferenceTitle: 'Amigos de Dios o amigos del mundo',
    conferenceNumber: 2,
    songNumber: 20,
    type: 'incoming',
    remindersSet: false
  },
  {
    id: 'a15',
    date: getSaturdayDate(8),
    time: '19:30',
    location: 'Colón',
    speakerId: 's5',
    speakerName: 'Roberto Silva',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'La felicidad verdadera',
    conferenceNumber: 4,
    songNumber: 27,
    type: 'outgoing',
    remindersSet: false
  },
  // Semana 10
  {
    id: 'a16',
    date: getSaturdayDate(10),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's8',
    speakerName: 'José González',
    speakerCongregation: 'Wheelwright',
    conferenceTitle: 'Asamblea Regional',
    conferenceNumber: undefined,
    songNumber: 1,
    customLabel: 'Asamblea Regional',
    type: 'event',
    remindersSet: false
  },
  // Semana 12
  {
    id: 'a17',
    date: getSaturdayDate(12),
    time: '19:30',
    location: 'Wheelwright',
    speakerId: 's3',
    speakerName: 'Carlos López',
    speakerCongregation: 'Hughes',
    conferenceTitle: '¿Conoce usted a Dios?',
    conferenceNumber: 1,
    songNumber: 10,
    type: 'incoming',
    remindersSet: false
  }
];
