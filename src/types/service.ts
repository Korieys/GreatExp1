export interface Service {
    id?: string;
    title: string;
    description: string;
    duration: string; // e.g. "50 min"
    price: string; // e.g. "$150"
    features: string[]; // List of bullet points
    icon?: string; // Icon name from lucide-react or image URL
    category: 'Clinical' | 'Coaching' | 'Assessment' | 'Other';
}
