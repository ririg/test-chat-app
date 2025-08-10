import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = typeof window !== 'undefined'
  ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
  : getFirestore(app);

const isLocalEmulator =
  typeof window !== 'undefined' &&
  ([ 'localhost', '127.0.0.1', '::1' ].includes(window.location.hostname) || process.env.NEXT_PUBLIC_USE_EMULATORS === 'true');

if (isLocalEmulator) {
  try { connectFirestoreEmulator(db, 'localhost', 8085); } catch {}
  try { connectFirestoreEmulator(db, '127.0.0.1', 8085); } catch {}
}