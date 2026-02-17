import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, LogOut, PlusCircle, Shield } from 'lucide-react';

interface Appointment {
    id: string;
    serviceType: string;
    date: string;
    time: string;
    status: string;
    documentUrl?: string;
    notes?: string;
}

const Portal = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, 'appointments'),
            where('userId', '==', currentUser.uid),
            // orderBy('date', 'desc') // Requires index, simpler to sort client-side for now or create index later
        );

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const apps = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Appointment[];

                // Client-side sort to avoid index creation requirement error immediately
                apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setAppointments(apps);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching appointments:", err);
                setError("Failed to load appointments. Please try again later.");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error('Failed to log out');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-48 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.email}</h1>
                        <p className="text-sm text-gray-500">Manage your appointments and documents</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/book" className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-xs font-black uppercase tracking-wider text-[#332a00] bg-secondary hover:bg-secondary/80 transition-all">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Appointment
                        </Link>
                        {/* Temporary Admin Link for testing/demo */}
                        {currentUser?.email && ['korieydixon@yahoo.com'].includes(currentUser.email.toLowerCase()) && (
                            <Link to="/admin" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider text-gray-700 bg-white hover:bg-gray-50 transition-all">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin Panel
                            </Link>
                        )}
                        <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs font-bold uppercase tracking-wider text-red-700 bg-white hover:bg-red-50 transition-all">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Your Appointments</h2>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {loading ? (
                            <li className="p-6 text-center text-gray-500">Loading appointments...</li>
                        ) : error ? (
                            <li className="p-6 text-center text-red-500">{error}</li>
                        ) : appointments.length === 0 ? (
                            <li className="p-6 text-center text-gray-500">No appointments found. Book your first one!</li>
                        ) : (
                            appointments.map((app) => (
                                <li key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <Calendar className="h-6 w-6 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-indigo-600">{app.serviceType}</p>
                                                <p className="text-xl font-semibold text-gray-900">{app.date} at {app.time}</p>
                                                <p className="text-sm text-gray-500 mt-1">Status: <span className={`capitalize font-medium ${app.status === 'confirmed' ? 'text-green-600' : 'text-amber-600'}`}>{app.status}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {app.documentUrl && (
                                                <a href={app.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600">
                                                    <FileText className="mr-1 h-4 w-4" />
                                                    View Document
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Portal;
