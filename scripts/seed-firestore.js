/**
 * Firestore Seeding Script
 * 
 * Usage:
 * 1. Download your serviceAccountKey.json from Firebase Console.
 * 2. Place it in the root of the project.
 * 3. Run: node scripts/seed-firestore.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json no encontrado en el directorio scripts/');
  console.log('👉 Por favor descarga tu Firebase Service Account Key desde la Consola de Firebase');
  console.log('   (Configuración del Proyecto > Cuentas de servicio > Generar nueva clave privada)');
  console.log('   y guárdalo como scripts/serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const MOCK_TITLES = [
  { number: 1, title: "¿Conoce usted a Dios?" },
  { number: 2, title: "Amigos de Dios o amigos del mundo" },
  { number: 3, title: "Sirva a Dios con alegría" },
  { number: 5, title: "La verdadera felicidad" },
  { number: 7, title: "La Biblia: ¿Mito o realidad?" },
  { number: 10, title: "La Biblia: ¿un libro para el hombre moderno?" },
  { number: 100, title: "Un nuevo mundo bajo la dirección de Cristo" }
];

const MOCK_SPEAKERS = [
  { id: 'sp1', name: 'Juan Pérez', congregation: 'Wheelwright', isLocal: true, phone: '2473456789' },
  { id: 'sp2', name: 'Diego Rossi', congregation: 'Wheelwright', isLocal: true, phone: '2473112233' },
  { id: 'sp3', name: 'Carlos López', congregation: 'Hughes', isLocal: false, phone: '2473000111' },
  { id: 'sp4', name: 'Martín García', congregation: 'Colón', isLocal: false, phone: '2475000222' }
];

const MOCK_NEIGHBORS = [
  { name: 'Hughes', town: 'Hughes', coordinatorName: 'Roberto Gómez', coordinatorPhone: '2473998877' },
  { name: 'Colón', town: 'Colón', coordinatorName: 'Samuel Sosa', coordinatorPhone: '2475443322' }
];

const MOCK_ARRANGEMENTS = [
  {
    id: 'arr1',
    date: '2024-12-29',
    time: '19:30',
    type: 'incoming',
    speakerName: 'Carlos López',
    speakerCongregation: 'Hughes',
    speakerId: 'sp3',
    conferenceTitle: 'La verdadera felicidad',
    conferenceNumber: 5,
    songNumber: 135,
    songTitle: 'Llamados por su nombre',
    remindersSet: false
  },
  {
    id: 'arr2',
    date: '2025-01-05',
    time: '19:30',
    type: 'incoming',
    speakerName: 'Martín García',
    speakerCongregation: 'Colón',
    speakerId: 'sp4',
    conferenceTitle: '¿Conoce usted a Dios?',
    conferenceNumber: 1,
    songNumber: 1,
    songTitle: 'Jehová es nuestro Dios',
    remindersSet: false
  },
  {
    id: 'arr3',
    date: '2025-01-12',
    time: '10:00',
    type: 'outgoing',
    speakerName: 'Juan Pérez',
    speakerCongregation: 'Wheelwright',
    speakerId: 'sp1',
    conferenceTitle: 'Amigos de Dios o amigos del mundo',
    conferenceNumber: 2,
    songNumber: 100,
    location: 'Hughes',
    remindersSet: false
  },
  {
    id: 'arr4',
    date: '2025-01-19',
    time: '19:30',
    type: 'event',
    conferenceTitle: 'Visita del Superintendente de Circuito',
    customLabel: 'Visita SC',
    remindersSet: false
  }
];

async function seed() {
  console.log('🚀 Iniciando carga de datos en Firestore...');

  // Seed Titles
  for (const title of MOCK_TITLES) {
    await db.collection('titles').doc(title.number.toString()).set(title);
  }
  console.log('✅ Títulos cargados.');

  // Seed Speakers
  for (const speaker of MOCK_SPEAKERS) {
    await db.collection('speakers').doc(speaker.id).set(speaker);
  }
  console.log('✅ Oradores cargados.');

  // Seed Neighbors
  for (const neighbor of MOCK_NEIGHBORS) {
    await db.collection('neighbors').add(neighbor);
  }
  console.log('✅ Congregaciones vecinas cargadas.');

  // Seed Arrangements
  for (const arr of MOCK_ARRANGEMENTS) {
    await db.collection('arrangements').doc(arr.id).set(arr);
  }
  console.log('✅ Conferencias (Arreglos) cargadas.');

  console.log('🎉 ¡Carga completada con éxito!');
  process.exit();
}

seed().catch(err => {
  console.error('❌ Error al cargar datos:', err);
  process.exit(1);
});
