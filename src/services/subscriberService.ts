import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';

export interface Subscriber {
    id: string;
    email: string;
    subscribedAt: any;
}

export const subscriberService = {
    async getAll(): Promise<Subscriber[]> {
        try {
            const q = query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Subscriber));
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            throw error;
        }
    },

    async delete(id: string) {
        try {
            await deleteDoc(doc(db, 'subscribers', id));
        } catch (error) {
            console.error("Error deleting subscriber:", error);
            throw error;
        }
    }
};
