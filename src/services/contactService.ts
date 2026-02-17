import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface InquiryData {
    parentName: string;
    email: string;
    serviceOfInterest: string;
    message: string;
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
    }
};
