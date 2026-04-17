import { collection, getDocs, query, where, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const runUpdates = async () => {
    try {
        console.log('Running updates...');

        // Update Site Content
        const contentRef = doc(db, 'siteContent', 'main');
        await setDoc(contentRef, {
            contactPhone: '832.399.6141',
            contactAddress: '1500 S. Dairy Ashford Rd. Suite 295\nHouston Texas 77077'
        }, { merge: true });
        console.log('Updated site content phone and address.');

        // Update Regan Boyd
        const practitionersRef = collection(db, 'practitioners');
        let q1 = query(practitionersRef, where('name', '==', 'Dr. Regan Boyd'));
        let snapshot = await getDocs(q1);

        if (snapshot.empty) {
            console.log('Not found under Dr. Regan Boyd, trying Regan Boyd...');
            q1 = query(practitionersRef, where('name', '==', 'Regan Boyd'));
            snapshot = await getDocs(q1);
        }

        if (!snapshot.empty) {
            const promises = snapshot.docs.map(docSnap => updateDoc(docSnap.ref, {
                credentials: 'Psy.D, LPC-S, CTRS',
                role: 'Director/co-founder'
            }));
            await Promise.all(promises);
            console.log('Updated Regan Boyd credentials and role.');
        } else {
            console.log('Could not find Regan Boyd in DB.');
        }
        
        console.log('Updates complete! Exiting...');
        process.exit(0);
    } catch (error) {
        console.error('Error running updates:', error);
        process.exit(1);
    }
};

runUpdates();
