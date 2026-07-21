import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { FileText, CheckCircle, User, XCircle, Trash2, Plus, Calendar as CalendarIcon, Clock, Loader2, Search, Eye } from 'lucide-react';
import { practitionerService } from '../services/practitionerService';
import { motion, AnimatePresence } from 'framer-motion';
import ChangePassword from '../components/auth/ChangePassword';
import ChangeEmail from '../components/auth/ChangeEmail';

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
    
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Practitioner State
    const [practitioners, setPractitioners] = useState<any[]>([]);

    // Side Drawer Details Panel States
    const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
    const [drawerNotes, setDrawerNotes] = useState('');
    const [drawerAssigned, setDrawerAssigned] = useState('');
    const [drawerStatus, setDrawerStatus] = useState<Appointment['status']>('pending');
    const [isSavingDrawer, setIsSavingDrawer] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        userEmail: '',
        serviceType: 'Initial Consultation',
        date: '',
        time: ''
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchPractitioners = async () => {
            try {
                const data = await practitionerService.getAll();
                setPractitioners(data);
            } catch (err) {
                console.error("Failed to load practitioners", err);
            }
        };
        fetchPractitioners();
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, 'appointments')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Appointment[];

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

    const openDrawer = (app: Appointment) => {
        setSelectedApp(app);
        setDrawerNotes(app.notes || '');
        setDrawerAssigned(app.assignedMember || '');
        setDrawerStatus(app.status || 'pending');
        setSaveSuccess(false);
    };

    const handleSaveDrawer = async () => {
        if (!selectedApp) return;
        setIsSavingDrawer(true);
        try {
            const appRef = doc(db, 'appointments', selectedApp.id);
            await updateDoc(appRef, {
                assignedMember: drawerAssigned,
                notes: drawerNotes,
                status: drawerStatus
            });
            
            // Instantly update the selected appointment state
            setSelectedApp({
                ...selectedApp,
                assignedMember: drawerAssigned,
                notes: drawerNotes,
                status: drawerStatus
            });

            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error updating appointment in drawer:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSavingDrawer(false);
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = 
            app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (app.assignedMember && app.assignedMember.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this appointment permanently?")) return;
        try {
            await deleteDoc(doc(db, 'appointments', id));
        } catch (error) {
            console.error("Error deleting appointment", error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await addDoc(collection(db, 'appointments'), {
                ...createForm,
                userId: 'admin-created', // Dummy ID for unlinked or we can create logic to find user
                status: 'confirmed',
                createdAt: serverTimestamp()
            });
            setShowCreate(false);
            setCreateForm({ userEmail: '', serviceType: 'Initial Consultation', date: '', time: '' });
        } catch (error) {
            console.error("Error creating appointment", error);
            alert("Failed to create appointment. Check console or Firestore rules.");
        } finally {
            setCreating(false);
        }
    };

    return (

        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
                    >
                        {showCreate ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showCreate ? 'Cancel' : 'Book Appointment'}
                    </button>
                    <span className="bg-white border border-slate-200 text-slate-600 shadow-sm text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {appointments.length} Active
                    </span>
                </div>
            </div>

            {showCreate && (
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 animate-in slide-in-from-top-4">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Manual Appointment Entry</h2>
                    <form onSubmit={handleCreate} className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Patient Email</label>
                            <input required type="email" value={createForm.userEmail} onChange={e => setCreateForm({ ...createForm, userEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" placeholder="patient@example.com" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Service</label>
                            <select value={createForm.serviceType} onChange={e => setCreateForm({ ...createForm, serviceType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                <option value="Initial Consultation">Initial Consultation</option>
                                <option value="Follow-up Session">Follow-up Session</option>
                                <option value="Diagnostic Assessment">Diagnostic Assessment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Date</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input required type="date" value={createForm.date} onChange={e => setCreateForm({ ...createForm, date: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <input required type="time" value={createForm.time} onChange={e => setCreateForm({ ...createForm, time: e.target.value })} className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-white" />
                            </div>
                        </div>
                        <div className="md:col-span-4 flex justify-end mt-2">
                            <button disabled={creating} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Search & Filters */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by client, service, or practitioner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Status Filter:</span>
                        <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${
                                        statusFilter === status
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

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
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                            Loading appointments...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">
                                        No appointments match your search criteria.
                                    </td>
                                </tr>
                            ) : filteredAppointments.map((app) => (
                                <tr 
                                    key={app.id} 
                                    onClick={() => openDrawer(app)}
                                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                                >
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900">{app.userEmail}</div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{app.serviceType}</div>
                                                {app.documentUrl && (
                                                    <a 
                                                        href={app.documentUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1.5"
                                                    >
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
                                                ${app.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                    app.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                                    'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                            {app.status}
                                        </span>
                                        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleStatusChange(app.id, 'confirmed'); 
                                                }} 
                                                className="p-1 px-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors text-xs font-bold flex items-center gap-1 border border-green-100/50" 
                                                title="Confirm"
                                            >
                                                <CheckCircle className="h-3 w-3" /> Approve
                                            </button>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleStatusChange(app.id, 'cancelled'); 
                                                }} 
                                                className="p-1 px-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1 border border-red-100/50" 
                                                title="Cancel"
                                            >
                                                <XCircle className="h-3 w-3" /> Cancel
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        {app.assignedMember ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-150">
                                                <User className="w-3 h-3 text-slate-400" />
                                                {app.assignedMember}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic font-medium">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        {app.notes ? (
                                            <span className="text-sm text-slate-600 font-medium truncate max-w-xs block border-b border-dashed border-slate-200 pb-0.5 hover:text-primary transition-colors" title="Click to view full notes">
                                                {app.notes}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic font-medium hover:text-primary transition-colors flex items-center gap-1">
                                                <Plus className="w-3.5 h-3.5" /> Add notes
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-3 items-center">
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    openDrawer(app); 
                                                }} 
                                                className="text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 hover:border-primary/20"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View & Edit
                                            </button>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleDelete(app.id); 
                                                }} 
                                                className="text-red-400 hover:text-red-600 transition-colors p-1.5 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100/50" 
                                                title="Delete Appointment"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Security Settings */}
            <div className="pt-8 border-t border-slate-200/60">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account & Security</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage your team member profile credentials.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
                    <ChangeEmail />
                    <ChangePassword />
                </div>
            </div>

            {/* Side Drawer Details Panel */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Background overlay */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
                                onClick={() => setSelectedApp(null)}
                            />

                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <motion.div 
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                                    className="pointer-events-auto w-screen max-w-md"
                                >
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl border-l border-slate-100">
                                        {/* Header */}
                                        <div className="bg-slate-950 px-6 py-6 sm:px-8 text-white">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h2 className="text-xl font-black tracking-tight" id="slide-over-title">Appointment Details</h2>
                                                    <p className="mt-1 text-xs text-slate-400 font-medium">Manage clinical notes and practitioner assignment.</p>
                                                </div>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-xl text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary p-2 hover:bg-slate-800 transition-colors"
                                                        onClick={() => setSelectedApp(null)}
                                                    >
                                                        <XCircle className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 py-6 px-6 sm:px-8 space-y-6 overflow-y-auto">
                                            {/* Patient Info */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-lg border border-primary/20">
                                                    {selectedApp.userEmail[0].toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-slate-900 truncate">{selectedApp.userEmail}</h3>
                                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{selectedApp.serviceType}</p>
                                                </div>
                                                {selectedApp.documentUrl && (
                                                    <a
                                                        href={selectedApp.documentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center shadow-sm"
                                                        title="View Attached PDF"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>

                                            {/* Date & Time */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                                                    <CalendarIcon className="w-5 h-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-slate-400">Date</p>
                                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApp.date}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-center gap-3">
                                                    <Clock className="w-5 h-5 text-slate-400" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-slate-400">Time</p>
                                                        <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedApp.time}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Selector */}
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Appointment Status</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                                                        <button
                                                            key={st}
                                                            type="button"
                                                            onClick={() => setDrawerStatus(st)}
                                                            className={`py-2 px-1 rounded-xl text-xs font-bold capitalize border text-center transition-all ${
                                                                drawerStatus === st
                                                                    ? st === 'confirmed' ? 'bg-green-500 text-white border-green-500 shadow-md shadow-green-500/25' :
                                                                      st === 'pending' ? 'bg-yellow-500 text-white border-yellow-500 shadow-md shadow-yellow-500/25' :
                                                                      st === 'cancelled' ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/25' :
                                                                      'bg-slate-700 text-white border-slate-700 shadow-md shadow-slate-700/25'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                                                            }`}
                                                        >
                                                            {st}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Assigned Practitioner (Dropdown list) */}
                                            <div>
                                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Assigned Practitioner</label>
                                                <select
                                                    value={drawerAssigned}
                                                    onChange={(e) => setDrawerAssigned(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
                                                >
                                                    <option value="">Unassigned</option>
                                                    {practitioners.map((p) => (
                                                        <option key={p.id} value={p.name}>
                                                            {p.name} ({p.role})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Notes Field */}
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-[10px] font-black uppercase text-slate-400">Patient & Clinical Notes</label>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(drawerNotes);
                                                                alert("Notes copied to clipboard!");
                                                            }}
                                                            className="text-[10px] text-primary hover:underline font-bold"
                                                            disabled={!drawerNotes}
                                                        >
                                                            Copy Notes
                                                        </button>
                                                        <span className="text-[10px] text-slate-400 font-bold">
                                                            {drawerNotes.length} chars
                                                        </span>
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={drawerNotes}
                                                    onChange={(e) => setDrawerNotes(e.target.value)}
                                                    placeholder="Add patient background, session goals, diagnoses, or administrative notes..."
                                                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
                                                    rows={8}
                                                />
                                                <p className="text-[10px] text-slate-400 font-medium mt-2 leading-relaxed">
                                                    💡 These notes are private and are only displayed to practitioners and administrators.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer / Save Actions */}
                                        <div className="border-t border-slate-100 px-6 py-6 sm:px-8 bg-slate-50 flex items-center justify-between gap-4">
                                            {saveSuccess ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2.5 rounded-xl border border-green-100 flex-1 justify-center animate-pulse">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Changes Saved Successfully!
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedApp(null)}
                                                        className="px-5 py-3 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveDrawer}
                                                        disabled={isSavingDrawer}
                                                        className="flex-1 flex justify-center items-center gap-2 bg-primary text-white py-3 px-5 text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50"
                                                    >
                                                        {isSavingDrawer ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save Changes'
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
