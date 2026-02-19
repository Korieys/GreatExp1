
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateSpecialties = async () => {
    try {
        const practitionersRef = collection(db, 'practitioners');

        // Update Dr. Regan Boyd
        const q1 = query(practitionersRef, where('name', '==', 'Dr. Regan Boyd'));
        const snapshot1 = await getDocs(q1);

        const specialtiesRegan = [
            "Clinical Psychology",
            "Trauma & Forensics",
            "Mood Disorders",
            "Therapeutic Recreation"
        ];

        if (!snapshot1.empty) {
            const promises = snapshot1.docs.map(doc => updateDoc(doc.ref, { specialties: specialtiesRegan }));
            await Promise.all(promises);
            console.log('Updated Dr. Regan Boyd specialties');
        }

        // Update Tonya Haynes
        const q2 = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshot2 = await getDocs(q2);

        const specialtiesTonya = [
            "CBT & Solution-Focused",
            "PHP & IOP Programs",
            "Chemical Dependency",
            "Adolescent Counseling"
        ];

        if (!snapshot2.empty) {
            const promises = snapshot2.docs.map(doc => updateDoc(doc.ref, { specialties: specialtiesTonya }));
            await Promise.all(promises);
            console.log('Updated Tonya Haynes specialties');
        }

    } catch (error) {
        console.error('Error updating specialties:', error);
    }
};
