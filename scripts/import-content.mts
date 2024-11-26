import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Verify environment variables are loaded
if (!process.env.FIREBASE_PROJECT_ID || 
    !process.env.FIREBASE_CLIENT_EMAIL || 
    !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing Firebase credentials in .env.local');
}

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();

async function importContent() {
  const contentDir = path.join(process.cwd(), 'components', 'home');
  
  try {
    // Read all JSON files from the directory
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));
    
    for (const file of files) {
      const section = path.basename(file, '.json'); // Remove .json extension
      const content = JSON.parse(
        fs.readFileSync(path.join(contentDir, file), 'utf-8')
      );
      
      console.log(`Importing ${section}...`);
      
      // Save to Firestore
      await db
        .collection('content')
        .doc('home')
        .collection('sections')
        .doc(section)
        .set(content);
        
      console.log(`✅ Imported ${section} successfully`);
    }
    
    console.log('🎉 All content imported successfully!');
  } catch (error) {
    console.error('Error importing content:', error);
  }
}

// Run the import
importContent();