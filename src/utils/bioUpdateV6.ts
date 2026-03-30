import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateTonyaBio = async () => {
    try {
        const practitionersRef = collection(db, 'practitioners');
        const q = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn('Tonya Haynes not found in database');
            return;
        }

        const bioTonya = `Tonya Haynes is the co-founder of Great Expectations Therapeutic Services and has over 20 years of experience in mental health. She has contributed to the establishment of two psychiatric hospitals, managed various outpatient clinics for PHP (Partial Hospitalization Program) and IOP (Intensive Outpatient Program), and has held roles in counseling, business development, and utilization review. Her comprehensive understanding spans the entire patient continuum—from admission into behavioral health facilities through treatment, case management, and community reintegration.

At Great Expectations Therapeutic Services, we offer personalized support to help clients stay productive and manage daily challenges. As a therapist and co-founder, she fosters an atmosphere of empathy and trust, guiding clients toward resilience and growth. Using evidence-based methods like CBT, solution-focused, and client-centered approaches, Ms. Haynes adapts each session to meet individual needs.

Tonya earned a Bachelor of Science in Psychology from Southern University A&M University in Baton Rouge, LA, and a Master’s degree in Counseling from Prairie View A&M University. She holds credentials as an LPC-Associate, LCDC-I, and CART, and is certified as a CPR/BLS instructor.

Outside of her professional commitments, Tonya enjoys baking, traveling, watching football, and spending quality time with family and friends. These interests, alongside her roles as wife and mother, reflect her multifaceted character.`;

        const promises = snapshot.docs.map(doc =>
            updateDoc(doc.ref, {
                bio: bioTonya
            })
        );

        await Promise.all(promises);
        console.log('Successfully updated Tonya Haynes bio!');
    } catch (error) {
        console.error('Error updating bio:', error);
    }
};
