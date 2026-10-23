import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface SiteContent {
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    clinicStatusText: string;
    clinicAcceptingNew: boolean;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    seoTitle: string;
    seoDescription: string;
}

export const defaultSiteContent: SiteContent = {
    heroTitleLine1: "Exceeding",
    heroTitleLine2: "the expected.",
    heroSubtitle: "A concierge clinical practice where specialized therapy meets uncompromising care. We partner with families to transform development from a challenge into a journey of discovery.",
    clinicStatusText: "Now Accepting New Patient Intakes",
    clinicAcceptingNew: true,
    contactPhone: "832.399.6141",
    contactEmail: "hello@greatexpectations.com",
    contactAddress: "1500 S. Dairy Ashford Rd. Suite 295\nHouston Texas 77077",
    seoTitle: "Great Expectations Therapy",
    seoDescription: "A concierge clinical practice where specialized therapy meets uncompromising care.",
};

export const contentService = {
    async getMainContent(): Promise<SiteContent> {
        const docRef = doc(db, 'siteContent', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const saved = docSnap.data();
            return Object.fromEntries(Object.entries(defaultSiteContent).map(([key, fallback]) => [
                key, typeof saved[key] === typeof fallback ? saved[key] : fallback,
            ])) as unknown as SiteContent;
        } else {
            // Public reads must never attempt an administrative write.
            return defaultSiteContent;
        }
    },

    async updateMainContent(content: Partial<SiteContent>): Promise<void> {
        const docRef = doc(db, 'siteContent', 'main');
        await setDoc(docRef, content, { merge: true });
    }
};
