export interface Availability {
    day: string; // 'Monday', 'Tuesday', ...
    startTime: string; // '09:00'
    endTime: string; // '17:00'
    isAvailable: boolean;
}

export interface Practitioner {
    id?: string;
    name: string;
    role: string;
    bio: string;
    email: string; // For linking to auth if needed later
    imageUrl?: string;
    summary?: string;
    credentials?: string;
    status?: string;
    specialties?: string[];
    availability: Availability[];
    createdAt?: any;
}

export interface Appointment {
    id: string;
    userId: string;
    userEmail: string;
    serviceType: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    documentUrl?: string;
    notes?: string;
    assignedMember?: string; // Could link to Practitioner.id
    practitionerId?: string; // selected practitioner
}
