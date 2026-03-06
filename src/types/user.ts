export interface UserProfile {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin' | 'practitioner' | 'patient';
    permissions?: ('content' | 'users' | 'appointments' | 'blog' | 'settings' | 'inquiries')[];
    createdAt: any; // Firestore Timestamp
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
}
