
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateSummaries = async () => {
    try {
        const practitionersRef = collection(db, 'practitioners');

        // Update Dr. Regan Boyd
        const q1 = query(practitionersRef, where('name', '==', 'Dr. Regan Boyd'));
        const snapshot1 = await getDocs(q1);

        const summaryRegan = "Dr. Regan Boyd is the co-founder of Greater Expectations Therapeutic Services and a dedicated mental health professional with over 25 years of experience. She is committed to ensuring accessible, compassionate, and patient-centered care for all.";

        if (!snapshot1.empty) {
            const promises = snapshot1.docs.map(doc => updateDoc(doc.ref, { summary: summaryRegan }));
            await Promise.all(promises);
            console.log('Updated Dr. Regan Boyd summary');
        }

        // Update Tonya Haynes
        const q2 = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshot2 = await getDocs(q2);

        const summaryTonya = "Tonya Haynes, co-founder of Great Expectations, brings over 20 years of mental health experience. A therapist and clinical director, she fosters empathy and trust, using evidence-based methods like CBT to guide clients toward resilience and growth.";

        if (!snapshot2.empty) {
            const promises = snapshot2.docs.map(doc => updateDoc(doc.ref, { summary: summaryTonya }));
            await Promise.all(promises);
            console.log('Updated Tonya Haynes summary');
        }

    } catch (error) {
        console.error('Error updating summaries:', error);
    }
};
