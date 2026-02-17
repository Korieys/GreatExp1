export interface UserProfile {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: any; // Firestore Timestamp
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
}
