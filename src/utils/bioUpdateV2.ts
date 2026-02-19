
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const updateBios = async () => {
    try {
        const practitionersRef = collection(db, 'practitioners');

        // Update Dr. Regan Boyd
        const q1 = query(practitionersRef, where('name', '==', 'Dr. Regan Boyd'));
        const snapshot1 = await getDocs(q1);

        const bioRegan = `Dr. Regan Boyd is the co-founder of Greater Expectations Therapeutic Services and a dedicated mental health professional with over 25 years of experience in the field. Throughout her career, Dr. Boyd has remained deeply committed to advocating for individuals experiencing mental health challenges and ensuring that quality care is accessible to all who seek support.

Dr. Boyd earned her Bachelor’s degree in Therapeutic Recreation from Southern University. She later obtained a Master’s degree in Organizational Management from the University of Phoenix, followed by a second Master’s degree in Counseling from Prairie View A&M University. She completed her doctoral degree in Clinical Psychology from California Southern University.

Her extensive professional background includes work in inpatient and outpatient facilities, private practice, forensic settings, and community mental health environments. This breadth of experience has equipped Dr. Boyd with a comprehensive understanding of the diverse needs of individuals across various stages of care and life circumstances.

Dr. Boyd’s passion lies in breaking down barriers to mental health services. She firmly believes that adequate, compassionate, and patient-centered mental health care should be accessible and affordable for everyone who desires help. Through co-founding Great Expectations Therapeutic Services, she has worked to ensure that the community receives not only professional expertise but also empathy, dignity, and individualized care.

Dr. Boyd’s ultimate hope is that every patient encounter leads to meaningful progress and positive recovery, empowering individuals to live healthier, more fulfilling lives.`;

        if (!snapshot1.empty) {
            const promises = snapshot1.docs.map(doc => updateDoc(doc.ref, { bio: bioRegan }));
            await Promise.all(promises);
            console.log('Updated Dr. Regan Boyd bio');
        } else {
            console.warn('Dr. Regan Boyd not found');
        }

        // Update Tonya Haynes
        const q2 = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshot2 = await getDocs(q2);

        const bioTonya = `Tonya Haynes is the co-founder of Great Expectations Therapeutic Services and has over 20 years of experience in mental health. She has contributed to the establishment of two psychiatric hospitals, managed various outpatient clinics for PHP (Partial Hospitalization Program) and IOP (Intensive Outpatient Program), and has held roles in counseling, business development, and utilization review. Her comprehensive understanding spans the entire patient continuum—from admission into behavioral health facilities through treatment, case management, and community reintegration.

At Great Expectations Therapeutic Services, we offer personalized support to help clients stay productive and manage daily challenges. As a therapist and co-founder, she fosters an atmosphere of empathy and trust, guiding clients toward resilience and growth. Using evidence-based methods like CBT, solution-focused, and client-centered approaches, Ms. Haynes adapts each session to meet individual needs.

Tonya earned a Bachelor of Science in Psychology from Southern University A&M University in Baton Rouge, LA, and a Master’s degree in Counseling from Prairie View A&M University. She holds credentials as an LPC-A, LCDC-I, and CART, and is certified as a CPR/BLS instructor.

Outside of her professional commitments, Tonya enjoys baking, traveling, watching football, and spending quality time with family and friends. These interests, alongside her roles as wife and mother, reflect her multifaceted character.`;

        if (!snapshot2.empty) {
            const promises = snapshot2.docs.map(doc => updateDoc(doc.ref, { bio: bioTonya }));
            await Promise.all(promises);
            console.log('Updated Tonya Haynes bio');
        } else {
            console.warn('Tonya Haynes not found');
        }

    } catch (error) {
        console.error('Error updating bios:', error);
    }
};
