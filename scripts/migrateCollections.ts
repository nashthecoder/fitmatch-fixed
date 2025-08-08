// Migration script to fix collection naming
// Run this AFTER deploying security rules

import { db } from './config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc 
} from 'firebase/firestore';

export const migrateCollections = async () => {
  console.log('🔄 Starting collection migration...');
  
  try {
    // 1. Migrate Evenements → events
    console.log('📅 Migrating Events...');
    const eventsSnapshot = await getDocs(collection(db, 'Evenements'));
    
    for (const docSnap of eventsSnapshot.docs) {
      const data = docSnap.data();
      
      // Add to new collection
      await addDoc(collection(db, 'events'), {
        ...data,
        migratedAt: new Date(),
        originalId: docSnap.id
      });
      
      console.log(`✅ Migrated event: ${data.titre}`);
    }
    
    // 2. Migrate Ads → ads  
    console.log('📢 Migrating Ads...');
    const adsSnapshot = await getDocs(collection(db, 'Ads'));
    
    for (const docSnap of adsSnapshot.docs) {
      const data = docSnap.data();
      
      // Add to new collection
      await addDoc(collection(db, 'ads'), {
        ...data,
        migratedAt: new Date(),
        originalId: docSnap.id
      });
      
      console.log(`✅ Migrated ad: ${data.titre}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('⚠️  Remember to:');
    console.log('1. Update all code references');
    console.log('2. Test thoroughly');
    console.log('3. Delete old collections after verification');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Code references that need updating:
const CODE_UPDATES_NEEDED = [
  'app/Events/EventList.tsx: line 66, 97',
  'app/Events/EditEvent.tsx: line 82, 191', 
  'app/Events/NewEvent.tsx: line 139',
  'app/Ads/AdList.tsx: line 70',
  // Add more as you find them
];

export { CODE_UPDATES_NEEDED };
