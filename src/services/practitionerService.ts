import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Practitioner } from '../types';

const COLLECTION_NAME = 'practitioners';

export const practitionerService = {
    // Get all practitioners
    getAll: async (): Promise<Practitioner[]> => {
        const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Practitioner));
    },

    // Get single practitioner
    getById: async (id: string): Promise<Practitioner | null> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Practitioner;
        }
        return null;
    },

    // Create practitioner
    create: async (practitioner: Omit<Practitioner, 'id'>, imageFile?: File): Promise<string> => {
        let imageUrl = '';
        if (imageFile) {
            const storageRef = ref(storage, `practitioners/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...practitioner,
            imageUrl,
            createdAt: new Date()
        });
        return docRef.id;
    },

    // Update practitioner
    update: async (id: string, updates: Partial<Practitioner>, imageFile?: File): Promise<void> => {
        let imageUrl = updates.imageUrl;
        if (imageFile) {
            const storageRef = ref(storage, `practitioners/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, { ...updates, imageUrl });
    },

    // Delete practitioner
    delete: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
