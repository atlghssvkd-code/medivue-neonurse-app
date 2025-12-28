'use client';

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { useAuth, useFirebase, useUser, useFirestore, useFirebaseApp, FirebaseProvider, useMemoFirebase } from './provider';
import { FirebaseClientProvider } from './client-provider';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';

// The singleton instances for Firebase services
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes and returns Firebase services. It ensures that Firebase is initialized
 * only once (singleton pattern).
 * @returns An object containing the initialized Firebase app, auth, and firestore instances.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    // Initialize Firebase if it hasn't been already
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // Get the existing app instance
    firebaseApp = getApp();
  }
  
  // Get service instances
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

// Export the necessary providers, hooks, and functions for use throughout the app
export {
  useAuth,
  useFirebase,
  useUser,
  useFirestore,
  useFirebaseApp,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useMemoFirebase,
};
