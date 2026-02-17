export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string; // HTML or Markdown
    coverImage?: string;
    author: string;
    category: string;
    tags: string[];
    published: boolean;
    publishedAt?: any; // Firestore Timestamp
    createdAt: any; // Firestore Timestamp
}
