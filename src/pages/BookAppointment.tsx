import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { practitionerService } from '../services/practitionerService';
import type { Practitioner } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const BookAppointment = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [serviceType, setServiceType] = useState('Consultation');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [selectedPractitionerId, setSelectedPractitionerId] = useState('');

    useEffect(() => {
        const loadPractitioners = async () => {
            try {
                const data = await practitionerService.getAll();
                setPractitioners(data);
            } catch (err) {
                console.error("Failed to load practitioners", err);
            }
        };
        loadPractitioners();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError('Selected file exceeds the 10 MB limit. Please select a smaller file.');
                e.target.value = '';
                setFile(null);
                return;
            }
            if (!ALLOWED_TYPES.includes(selectedFile.type)) {
                setError('Invalid file type. Allowed formats: PDF, JPEG, PNG, or WebP.');
                e.target.value = '';
                setFile(null);
                return;
            }
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!currentUser) {
            setError('You must be logged in to book an appointment.');
            setLoading(false);
            return;
        }

        try {
            let fileUrl = '';
            if (file) {
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const fileRef = ref(storage, `appointments/${currentUser.uid}/${Date.now()}_${sanitizedName}`);
                await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(fileRef);
            }

            await addDoc(collection(db, 'appointments'), {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                serviceType,
                date,
                time,
                notes: notes.slice(0, 2000),
                documentUrl: fileUrl,
                status: 'pending', // pending, confirmed, completed, cancelled
                createdAt: serverTimestamp(),
                practitionerId: selectedPractitionerId || null,
            });

            navigate('/portal');
        } catch (err: any) {
            console.error("Appointment booking error:", err);
            setError('Failed to book appointment. Your entries were preserved. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-48 pb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Book an Appointment</h1>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Schedule a consultation or follow-up session. For new patient clinical intake packets, please complete forms via the{' '}
                <Link to="/forms" className="text-primary font-medium underline underline-offset-4">practice intake portal</Link>.
            </p>

            {error && (
                <div role="alert" className="mb-6 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <label htmlFor="practitioner-select" className="block text-sm font-medium text-gray-700">Practitioner (Optional)</label>
                    <select
                        id="practitioner-select"
                        value={selectedPractitionerId}
                        onChange={(e) => setSelectedPractitionerId(e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-3 bg-white"
                    >
                        <option value="">Any Available Practitioner</option>
                        {practitioners.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} ({p.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="service-type-select" className="block text-sm font-medium text-gray-700">Service Type</label>
                    <select
                        id="service-type-select"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-3 bg-white"
                    >
                        <option value="Consultation">Consultation</option>
                        <option value="Therapy Session">Therapy Session</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Follow-up">Follow-up</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            id="appointment-date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-3 bg-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            id="appointment-time"
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-3 bg-white"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="appointment-documents" className="block text-sm font-medium text-gray-700">
                        Upload Document (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Upload insurance card, photo ID, or referral document (PDF, PNG, JPEG, up to 10 MB). Stored securely and accessible only to you and authorized clinic staff.
                    </p>
                    <input
                        id="appointment-documents"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-xl file:border-0
                            file:text-xs file:font-bold
                            file:bg-slate-100 file:text-slate-700
                            hover:file:bg-slate-200 cursor-pointer"
                    />
                </div>

                <div>
                    <label htmlFor="appointment-notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea
                        id="appointment-notes"
                        rows={3}
                        maxLength={2000}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-3 resize-none bg-white font-medium"
                        placeholder="Any general concerns or scheduling preferences (share detailed clinical records through the intake portal)..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black uppercase tracking-wider text-[#332a00] bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary cursor-pointer ${loading ? 'opacity-50' : 'transition-transform hover:scale-[1.01]'}`}
                >
                    {loading ? 'Submitting Booking Request...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
