import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FileText, CheckCircle, User, XCircle } from 'lucide-react';

interface Appointment {
    id: string;
    userId: string;
    userEmail: string;
    serviceType: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    documentUrl?: string;
    notes?: string;
    assignedMember?: string;
}

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ assignedMember: string, notes: string }>({ assignedMember: '', notes: '' });

    useEffect(() => {
        const q = query(
            collection(db, 'appointments')
            // orderBy('createdAt', 'desc') // Requires index
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[];

            // Client-side sort
            apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setAppointments(apps);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
        try {
            const appRef = doc(db, 'appointments', id);
            await updateDoc(appRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const startEdit = (app: Appointment) => {
        setEditingId(app.id);
        setEditForm({
            assignedMember: app.assignedMember || '',
            notes: app.notes || ''
        });
    };

    const saveEdit = async (id: string) => {
        try {
            const appRef = doc(db, 'appointments', id);
            await updateDoc(appRef, {
                assignedMember: editForm.assignedMember,
                notes: editForm.notes
            });
            setEditingId(null);
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Failed to update appointment");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                        {appointments.length} Total Appointments
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client / Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-4 text-center">Loading...</td></tr>
                                ) : appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{app.userEmail}</div>
                                                    <div className="text-sm text-gray-500">{app.serviceType}</div>
                                                    {app.documentUrl && (
                                                        <a href={app.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1">
                                                            <FileText className="h-3 w-3" /> View Doc
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{app.date}</div>
                                            <div className="text-sm text-gray-500">{app.time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${app.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {app.status}
                                            </span>
                                            <div className="mt-2 flex gap-1">
                                                <button onClick={() => handleStatusChange(app.id, 'confirmed')} className="text-green-600 hover:text-green-900" title="Confirm"><CheckCircle className="h-4 w-4" /></button>
                                                <button onClick={() => handleStatusChange(app.id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Cancel"><XCircle className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === app.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.assignedMember}
                                                    onChange={(e) => setEditForm({ ...editForm, assignedMember: e.target.value })}
                                                    className="border rounded px-2 py-1 text-sm w-full"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-900">{app.assignedMember || 'Unassigned'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === app.id ? (
                                                <textarea
                                                    value={editForm.notes}
                                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                    className="border rounded px-2 py-1 text-sm w-full"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-500 truncate max-w-xs block" title={app.notes}>{app.notes || '-'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingId === app.id ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveEdit(app.id)} className="text-indigo-600 hover:text-indigo-900">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => startEdit(app)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
