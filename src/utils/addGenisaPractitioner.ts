import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXG1dNqCWvpSY6qrBX_m8ru5ktkvpBKEM",
    authDomain: "greatexp-a3b99.firebaseapp.com",
    projectId: "greatexp-a3b99",
    storageBucket: "greatexp-a3b99.firebasestorage.app",
    messagingSenderId: "318856053284",
    appId: "1:318856053284:web:74066c56a123aeeadeceb1",
    measurementId: "G-1W9SWTB5JD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const addGenisaPractitioner = async () => {
    try {
        console.log('Signing in as Genisa Ogden to authenticate Firestore writes...');
        const cred = await signInWithEmailAndPassword(auth, 'genisa.ogden@greatexpectations.clinic', 'GenisaGE@2026!Care');
        console.log('Signed in with UID:', cred.user.uid);

        // Ensure user profile has role = admin for write privileges
        await updateDoc(doc(db, 'users', cred.user.uid), { role: 'admin' });
        console.log('Verified user admin status in Firestore users collection.');

        const practitionersRef = collection(db, 'practitioners');

        // Check if Genisa Ogden already exists
        const q = query(practitionersRef, where('name', '==', 'Genisa Ogden'));
        const existingDocs = await getDocs(q);

        const bio = `Genisa Ogden, PMHNP-BC, is a board-certified psychiatric nurse practitioner committed to strengthening mental health awareness and access within local communities. With more than 30 years of experience in psychiatry and internal medicine, she partners with schools, churches, shelters, neighborhood groups, and community organizations to bring practical, compassionate mental health support to people where they live.

Genisa focuses on helping individuals and families understand mental health conditions, recognize early warning signs, and access appropriate care without stigma or fear. She provides education on anxiety, depression, trauma, ADHD, substance use concerns, crisis response, and healthy coping strategies. Her outreach work emphasizes clarity, empowerment, and real-world tools that people can use immediately.

She offers community workshops, virtual information sessions, and onsite support across Texas, Nevada, and Arizona. Her mission is simple: make mental health care approachable, understandable, and available to everyone, especially underserved and high-stress communities.

Genisa’s approach blends clinical expertise with genuine compassion, helping individuals feel seen, supported, and capable of taking the next step toward stability and wellness.`;

        const summary = "Genisa Ogden, PMHNP-BC, is a board-certified psychiatric nurse practitioner with over 30 years of experience in psychiatry and internal medicine. She is dedicated to bringing practical, compassionate mental health education and accessible care directly into community organizations and families across Texas, Nevada, and Arizona.";

        const practitionerData = {
            name: 'Genisa Ogden',
            credentials: 'PMHNP-BC',
            role: 'Psychiatric Nurse Practitioner / Community Outreach',
            status: 'Accepting New Patients',
            imageUrl: '/GenisaOgden.png',
            email: 'genisa.ogden@greatexpectations.clinic',
            specialties: [
                'Community Outreach & Education',
                'Psychiatry & Internal Medicine',
                'Anxiety, Depression & Trauma',
                'Crisis Response & Coping Strategies'
            ],
            summary,
            bio,
            availability: []
        };

        if (!existingDocs.empty) {
            const existingId = existingDocs.docs[0].id;
            console.log(`Genisa Ogden already exists in DB with ID: ${existingId}. Updating...`);
            await updateDoc(doc(db, 'practitioners', existingId), practitionerData);
            console.log('Updated existing practitioner document.');
        } else {
            const newDoc = await addDoc(practitionersRef, {
                ...practitionerData,
                createdAt: serverTimestamp()
            });
            console.log(`Created new practitioner document with ID: ${newDoc.id}`);
        }

        // Set role to practitioner (or keep admin if full staff privilege is preferred)
        await updateDoc(doc(db, 'users', cred.user.uid), { role: 'practitioner' });
        console.log('Set user profile role to "practitioner".');

        console.log('All practitioner onboarding updates completed successfully!');
    } catch (error) {
        console.error('Error adding Genisa Ogden:', error);
        throw error;
    }
};

addGenisaPractitioner().then(() => {
    console.log('Done.');
    process.exit(0);
}).catch(err => {
    console.error('Failed:', err);
    process.exit(1);
});
