'use client';

import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

let firebaseApp: ReturnType<typeof initializeFirebase> | null = null;

function getFirebase() {
  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }
  return firebaseApp;
}

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = getFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
