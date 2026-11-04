import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase client instance
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check helper with gentle timeout fallback
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const checkPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('connection timeout')), 4000)
    );
    await Promise.race([checkPromise, timeoutPromise]);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('timeout') || error.message.includes('Could not reach'))) {
      console.warn('Firestore offline fallback active:', error.message);
      return false;
    }
    // If doc just doesn't exist, connection succeeded!
    return true;
  }
}
