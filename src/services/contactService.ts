import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';

export interface InquiryData {
    parentName: string;
    email: string;
    serviceOfInterest: string;
    message: string;
}

export interface Inquiry extends InquiryData {
    id: string;
    status: 'new' | 'read' | 'archived';
    createdAt: any;
}

export const contactService = {
    async createInquiry(data: InquiryData) {
        try {
            await addDoc(collection(db, 'inquiries'), {
                ...data,
                status: 'new',
                createdAt: serverTimestamp(),
            });
            return { success: true };
        } catch (error) {
            console.error("Error creating inquiry:", error);
            throw error;
        }
    },

    async getAll(): Promise<Inquiry[]> {
        try {
            const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Inquiry));
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            throw error;
        }
    },

    async updateStatus(id: string, status: 'new' | 'read' | 'archived') {
        try {
            await updateDoc(doc(db, 'inquiries', id), { status });
        } catch (error) {
            console.error("Error updating inquiry status:", error);
            throw error;
        }
    },

    async delete(id: string) {
        try {
            await deleteDoc(doc(db, 'inquiries', id));
        } catch (error) {
            console.error("Error deleting inquiry:", error);
            throw error;
        }
    }
};
