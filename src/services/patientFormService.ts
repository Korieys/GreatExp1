import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface PatientFormData {
    patientName: string;
    documentType: string;
    uploadedBy: string | null; // User ID if logged in, or null
}

export const patientFormService = {
    async uploadPatientForm(file: File, data: PatientFormData) {
        try {
            // 1. Upload file to Firebase Storage
            // Path: patient-forms/{timestamp}_{filename}
            const timestamp = Date.now();
            const storagePath = `patient-forms/${timestamp}_${file.name}`;
            const storageRef = ref(storage, storagePath);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save metadata to Firestore
            await addDoc(collection(db, 'patient_forms'), {
                ...data,
                fileName: file.name,
                fileUrl: downloadURL,
                storagePath: storagePath,
                status: 'uploaded',
                createdAt: serverTimestamp(),
            });

            return { success: true };
        } catch (error) {
            console.error("Error uploading patient form:", error);
            throw error;
        }
    }
};
