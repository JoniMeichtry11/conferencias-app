/**
 * Firestore Seed Titles Script
 * 
 * This script seeds the 'titles' collection with the 194 public talk titles
 * from the 'public/discursos.json' file.
 * 
 * Usage: node scripts/seed-titles.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json no encontrado en el directorio scripts/');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedTitles() {
  const jsonPath = path.join(__dirname, '..', 'public', 'discursos.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Error: public/discursos.json no encontrado.');
    process.exit(1);
  }

  const discursos = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`🚀 Iniciando carga de ${discursos.length} títulos en Firestore...`);

  const batchSize = 500; // Firestore limit for batches
  let count = 0;

  for (let i = 0; i < discursos.length; i += batchSize) {
    const batch = db.batch();
    const chunk = discursos.slice(i, i + batchSize);

    chunk.forEach(discurso => {
      const docRef = db.collection('titles').doc(discurso.number.toString());
      batch.set(docRef, discurso);
      count++;
    });

    await batch.commit();
    console.log(`✅ Lote procesado. Total cargados: ${count}`);
  }

  console.log('🎉 ¡Carga de títulos completada con éxito!');
  process.exit(0);
}

seedTitles().catch(err => {
  console.error('❌ Error al cargar títulos:', err);
  process.exit(1);
});
