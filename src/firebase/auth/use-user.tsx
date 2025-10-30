'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '../errors';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        
        if (firestore) {
            const userRef = doc(firestore, `users/${userAuth.uid}`);
            const userData = {
                uid: userAuth.uid,
                email: userAuth.email,
                displayName: userAuth.displayName,
                photoURL: userAuth.photoURL,
                lastLogin: serverTimestamp(),
            };
            
            setDoc(userRef, userData, { merge: true }).catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                path: userRef.path,
                operation: 'update',
                requestResourceData: userData,
              } satisfies SecurityRuleContext);
              errorEmitter.emit('permission-error', permissionError);
            });
        }
        
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  return { user, loading };
}
