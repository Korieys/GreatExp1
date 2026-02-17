import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile } from '../types/user';

const COLLECTION_NAME = 'users';

export const userService = {
    // Get all users (for admin)
    getAll: async (): Promise<UserProfile[]> => {
        // Note: fetch limit should be paginated in real app
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as UserProfile);
    },

    // Get single user by ID
    getById: async (uid: string): Promise<UserProfile | null> => {
        const docRef = doc(db, COLLECTION_NAME, uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    },

    // Get total count (simplified)
    getCount: async (): Promise<number> => {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.size;
    }
};
