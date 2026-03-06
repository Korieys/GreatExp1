import { useEffect, useState } from 'react';
import { Trash2, Archive, CheckCircle, Search, Inbox } from 'lucide-react';
import { contactService, type Inquiry } from '../services/contactService';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');

    const loadInquiries = async () => {
        try {
            const data = await contactService.getAll();
            setInquiries(data);
        } catch (error) {
            console.error("Failed to load inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries();
    }, []);

    const handleStatusChange = async (id: string, status: 'new' | 'read' | 'archived') => {
        try {
            await contactService.updateStatus(id, status);
            setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
        try {
            await contactService.delete(id);
            setInquiries(inquiries.filter(inq => inq.id !== id));
        } catch (error) {
            alert("Failed to delete inquiry");
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const matchesSearch =
            inq.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inq.serviceOfInterest.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'all' || inq.status === filter;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary mb-4"></div>
                <p className="text-slate-400 font-medium">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inquiries</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage contact form messages and consultation requests.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                {['all', 'new', 'read', 'archived'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`capitalize px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {f}
                        {f === 'new' && inquiries.filter(i => i.status === 'new').length > 0 && (
                            <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
                                {inquiries.filter(i => i.status === 'new').length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredInquiries.length === 0 ? (
                    <div className="bg-white/50 border border-slate-100 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                            <Inbox className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No messages found</h3>
                        <p className="text-slate-500 text-sm">You're all caught up! No inquiries match your current filters.</p>
                    </div>
                ) : (
                    filteredInquiries.map((inq) => (
                        <div
                            key={inq.id}
                            className={`bg-white rounded-2xl p-6 shadow-sm border transition-shadow hover:shadow-md
                                ${inq.status === 'new' ? 'border-primary/30 shadow-primary/5' : 'border-slate-100'}
                            `}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg
                                            ${inq.status === 'new' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}
                                        `}>
                                            {inq.parentName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{inq.parentName}</h3>
                                            <a href={`mailto:${inq.email}`} className="text-sm font-medium text-primary hover:underline">{inq.email}</a>
                                        </div>
                                        <div className="ml-auto md:ml-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            {inq.createdAt?.seconds ? new Date(inq.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Interest: <span className="text-slate-700">{inq.serviceOfInterest}</span></p>
                                        <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{inq.message}</p>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 justify-start md:justify-center border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0 border-slate-100">
                                    {inq.status !== 'read' && inq.status !== 'archived' && (
                                        <button
                                            onClick={() => handleStatusChange(inq.id, 'read')}
                                            className="p-2 md:px-4 md:py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" /> <span className="hidden md:inline">Mark Read</span>
                                        </button>
                                    )}
                                    {inq.status !== 'archived' && (
                                        <button
                                            onClick={() => handleStatusChange(inq.id, 'archived')}
                                            className="p-2 md:px-4 md:py-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                                        >
                                            <Archive className="w-4 h-4" /> <span className="hidden md:inline">Archive</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(inq.id)}
                                        className="p-2 md:px-4 md:py-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors font-bold text-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminInquiries;
