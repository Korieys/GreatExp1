import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import type { BlogPost } from '../types/blog';

const COLLECTION_NAME = 'posts';

export const blogService = {
    // Get all posts (admin view)
    getAll: async (): Promise<BlogPost[]> => {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    },

    // Get published posts (public view)
    getPublished: async (): Promise<BlogPost[]> => {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('published', '==', true),
            orderBy('publishedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
    },

    // Get single post by ID
    getById: async (id: string): Promise<BlogPost | null> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPost;
        }
        return null;
    },

    // Get post by Slug
    getBySlug: async (slug: string): Promise<BlogPost | null> => {
        const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as BlogPost;
        }
        return null;
    },

    // Create post
    create: async (post: Omit<BlogPost, 'id' | 'createdAt'>, file?: File): Promise<string> => {
        let coverImageUrl = post.coverImage;

        if (file) {
            const fileRef = ref(storage, `blog/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            coverImageUrl = await getDownloadURL(fileRef);
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...post,
            coverImage: coverImageUrl || null,
            createdAt: serverTimestamp(),
            publishedAt: post.published ? serverTimestamp() : null
        });
        return docRef.id;
    },

    // Update post
    update: async (id: string, updates: Partial<BlogPost>, file?: File): Promise<void> => {
        let coverImageUrl = updates.coverImage;

        if (file) {
            const fileRef = ref(storage, `blog/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            coverImageUrl = await getDownloadURL(fileRef);
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...updates,
            coverImage: coverImageUrl,
            publishedAt: updates.published ? (updates.publishedAt || serverTimestamp()) : null
        });
    },

    // Delete post
    delete: async (id: string): Promise<void> => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    }
};
