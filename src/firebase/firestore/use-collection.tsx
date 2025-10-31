'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface CollectionData<T> {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
  loadMore?: () => void;
  hasMore?: boolean;
}

export function useCollection<T>(
  path: string,
  options?: {
    orderBy?: string;
    limit?: number;
    skip?: boolean;
  }
): CollectionData<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!firestore || options?.skip) {
        setLoading(false);
        return;
    }
    setLoading(true);

    let q: Query<DocumentData> = collection(firestore, path);

    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy));
    }
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(newData);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === options?.limit);
        setLoading(false);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, options?.orderBy, options?.limit, options?.skip]);

  const loadMore = () => {
    if (!firestore || !lastDoc || !hasMore || loading) return;
    setLoading(true);

    let q: Query<DocumentData> = collection(firestore, path);
    if (options?.orderBy) {
      q = query(q, orderBy(options.orderBy));
    }
    if (options?.limit) {
      q = query(q, limit(options.limit));
    }
    q = query(q, startAfter(lastDoc));

    onSnapshot(q, (snapshot) => {
      const moreData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      setData((prev) => [...prev, ...moreData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === options?.limit);
      setLoading(false);
    },
    (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: path,
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
    });
  };

  return { data, loading, error, loadMore: options?.limit ? loadMore : undefined, hasMore };
}

    