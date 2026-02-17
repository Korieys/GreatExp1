import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { Service } from '../types/service';

const COLLECTION_NAME = 'services';

export const serviceService = {
    // Get all services
    getAll: async (): Promise<Service[]> => {
        const q = query(collection(db, COLLECTION_NAME), orderBy('title'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    },

    // Get single service
    getById: async (id: string): Promise<Service | null> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Service;
        }
        return null;
    },

    // Create service
    create: async (service: Omit<Service, 'id'>): Promise<string> => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...service,
            createdAt: new Date()
        });
        return docRef.id;
    },

    // Update service
    update: async (id: string, updates: Partial<Service>): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updates);
    },

    // Delete service
    delete: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
