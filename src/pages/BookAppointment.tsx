import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
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
                const fileRef = ref(storage, `appointments/${currentUser.uid}/${Date.now()}_${file.name}`);
                await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(fileRef);
            }

            await addDoc(collection(db, 'appointments'), {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                serviceType,
                date,
                time,
                notes,
                documentUrl: fileUrl,
                status: 'pending', // pending, confirmed, completed, cancelled
                createdAt: serverTimestamp(),
            });

            alert('Appointment booked successfully!');
            navigate('/portal');
        } catch (err: any) {
            console.error(err);
            setError('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Book an Appointment</h1>
            {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                    <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        <option value="Consultation">Consultation</option>
                        <option value="Therapy Session">Therapy Session</option>
                        <option value="Assessment">Assessment</option>
                        <option value="Follow-up">Follow-up</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Documents (Optional)</label>
                    <p className="text-xs text-gray-500 mb-2">Upload insurance card or ID.</p>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        placeholder="Any specific concerns or details..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? 'Booking...' : 'Book Appointment'}
                </button>
            </form>
        </div>
    );
};

export default BookAppointment;
