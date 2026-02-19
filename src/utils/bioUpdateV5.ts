
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateTonyaImage = async () => {
    try {
        const practitionersRef = collection(db, 'practitioners');
        const q = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn('Tonya Haynes not found in database');
            return;
        }

        const promises = snapshot.docs.map(doc =>
            updateDoc(doc.ref, {
                imageUrl: '/TonyaHaynes.jpeg'
            })
        );

        await Promise.all(promises);
        console.log('Successfully updated Tonya Haynes image URL');
    } catch (error) {
        console.error('Error updating image URL:', error);
    }
};
