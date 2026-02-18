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

        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                <span className="bg-white border border-slate-200 text-slate-600 shadow-sm text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {appointments.length} Active Appointments
                </span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Service</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Loading appointments...</td></tr>
                            ) : appointments.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900">{app.userEmail}</div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{app.serviceType}</div>
                                                {app.documentUrl && (
                                                    <a href={app.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1.5">
                                                        <FileText className="h-3 w-3" /> View Doc
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{app.date}</div>
                                        <div className="text-xs text-slate-500 font-medium">{app.time}</div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-widest font-black rounded-full 
                                                ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {app.status}
                                        </span>
                                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleStatusChange(app.id, 'confirmed')} className="p-1 px-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs font-bold flex items-center gap-1" title="Confirm">
                                                <CheckCircle className="h-3 w-3" /> Approve
                                            </button>
                                            <button onClick={() => handleStatusChange(app.id, 'cancelled')} className="p-1 px-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1" title="Cancel">
                                                <XCircle className="h-3 w-3" /> Cancel
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        {editingId === app.id ? (
                                            <input
                                                type="text"
                                                value={editForm.assignedMember}
                                                onChange={(e) => setEditForm({ ...editForm, assignedMember: e.target.value })}
                                                className="border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-primary focus:border-primary"
                                                placeholder="Assign to..."
                                            />
                                        ) : (
                                            <span className={`text-sm font-medium ${app.assignedMember ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                                                {app.assignedMember || 'Unassigned'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        {editingId === app.id ? (
                                            <textarea
                                                value={editForm.notes}
                                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                className="border-slate-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-primary focus:border-primary"
                                                rows={2}
                                            />
                                        ) : (
                                            <span className="text-sm text-slate-500 font-medium truncate max-w-xs block" title={app.notes}>{app.notes || '-'}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                                        {editingId === app.id ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => saveEdit(app.id)} className="text-primary hover:text-blue-700 font-bold">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEdit(app)} className="text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-wider">Edit Details</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
