import { collection, getDocs, query, where, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const runJune2026Updates = async () => {
    try {
        console.log('Starting DB Updates for June 2026...');

        const practitionersRef = collection(db, 'practitioners');

        // 1. Update Tonya Haynes Profile
        console.log('Updating Tonya Haynes profile...');
        const qTonya = query(practitionersRef, where('name', '==', 'Tonya Haynes'));
        const snapshotTonya = await getDocs(qTonya);

        if (snapshotTonya.empty) {
            console.warn('Tonya Haynes profile not found in DB');
        } else {
            for (const docSnap of snapshotTonya.docs) {
                const currentData = docSnap.data();
                const currentBio = currentData.bio || '';
                // Remove "Associate" from LPC-Associate references in bio and credentials
                const updatedBio = currentBio.replace(/LPC-Associate/g, 'LPC');
                await updateDoc(docSnap.ref, {
                    credentials: 'LPC, LCDC-I, CART',
                    bio: updatedBio
                });
                console.log(`Successfully updated Tonya Haynes (ID: ${docSnap.id}) credentials and bio.`);
            }
        }

        // 2. Update Regan Boyd Profile
        console.log('Updating Regan Boyd profile...');
        let qRegan = query(practitionersRef, where('name', '==', 'Dr. Regan Boyd'));
        let snapshotRegan = await getDocs(qRegan);

        if (snapshotRegan.empty) {
            console.log('Regan Boyd not found under "Dr. Regan Boyd", searching "Regan Boyd"...');
            qRegan = query(practitionersRef, where('name', '==', 'Regan Boyd'));
            snapshotRegan = await getDocs(qRegan);
        }

        if (snapshotRegan.empty) {
            console.warn('Regan Boyd profile not found in DB');
        } else {
            for (const docSnap of snapshotRegan.docs) {
                const currentData = docSnap.data();
                const currentSpecialties: string[] = currentData.specialties || [];
                const targetSpecialty = 'Substance Abuse Counseling';
                
                let updatedSpecialties = [...currentSpecialties];
                if (!updatedSpecialties.includes(targetSpecialty)) {
                    updatedSpecialties.push(targetSpecialty);
                }

                await updateDoc(docSnap.ref, {
                    specialties: updatedSpecialties
                });
                console.log(`Successfully updated Regan Boyd (ID: ${docSnap.id}) specialties:`, updatedSpecialties);
            }
        }

        // 3. Upsert Services
        console.log('Upserting services...');
        const servicesRef = collection(db, 'services');
        const targetServices = [
            {
                title: 'Traditional Outpatient Mental Health Services',
                category: 'Clinical',
                description: 'Traditional individual, couples, and family therapy addressing emotional, behavioral, and relational concerns in a comfortable outpatient setting.',
                features: ['Individual Therapy', 'Family Therapy', 'Couples Counseling'],
                price: 'Varies'
            },
            {
                title: 'Partial Hospitalization',
                category: 'Clinical',
                description: 'Comprehensive day treatment programs offering structured therapeutic stabilization and clinical care pathways.',
                features: ['Structured Day Treatment', 'Clinical Stabilization', 'Multi-Disciplinary Care'],
                price: 'Varies'
            },
            {
                title: 'Intensive Outpatient',
                category: 'Clinical',
                description: 'Structured therapeutic recovery pathways designed for intensive support while maintaining daily home and school routines.',
                features: ['Flexible Recovery Path', 'Group Therapy', 'Sustainable Healing'],
                price: 'Varies'
            },
            {
                title: 'Wraparound Services',
                category: 'Clinical',
                description: 'Holistic care coordination integrating family, school, and community resources to support children and adolescents.',
                features: ['Care Coordination', 'School Integration', 'Holistic Support'],
                price: 'Varies'
            },
            {
                title: 'Supervised Visitation Services',
                category: 'Clinical',
                description: 'Safe, supportive, and clinically monitored visits ensuring child safety and parent-child relationship support.',
                features: ['Clinically Monitored', 'Safe Environment', 'Parent-Child Bonding'],
                price: 'Varies'
            }
        ];

        for (const service of targetServices) {
            const qService = query(servicesRef, where('title', '==', service.title));
            const snapshotService = await getDocs(qService);

            if (!snapshotService.empty) {
                // Update existing
                const docSnap = snapshotService.docs[0];
                await updateDoc(docSnap.ref, service);
                console.log(`Updated existing service: "${service.title}"`);
            } else {
                // Create new
                await addDoc(servicesRef, {
                    ...service,
                    createdAt: serverTimestamp()
                });
                console.log(`Created new service: "${service.title}"`);
            }
        }

        console.log('Updates successfully executed! Exiting...');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error during DB updates:', error);
        process.exit(1);
    }
};

runJune2026Updates();
