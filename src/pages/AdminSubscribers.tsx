import { useEffect, useState } from 'react';
import { Mail, Trash2, Download, Search, Users } from 'lucide-react';
import { subscriberService, type Subscriber } from '../services/subscriberService';

const AdminSubscribers = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadSubscribers = async () => {
        try {
            const data = await subscriberService.getAll();
            setSubscribers(data);
        } catch (error) {
            console.error("Failed to load subscribers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscribers();
    }, []);

    const handleDelete = async (id: string, email: string) => {
        if (!window.confirm(`Are you sure you want to remove ${email} from the mailing list?`)) return;
        try {
            await subscriberService.delete(id);
            setSubscribers(subscribers.filter(sub => sub.id !== id));
        } catch (error) {
            alert("Failed to delete subscriber");
        }
    };

    const handleExportCSV = () => {
        if (subscribers.length === 0) return;

        // Define CSV headers
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Email,Date Subscribed\n";

        // Add rows
        subscribers.forEach(sub => {
            const dateStr = sub.subscribedAt?.seconds ? new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString() : 'Unknown';
            csvContent += `${sub.email},${dateStr}\n`;
        });

        // Create download link and trigger click
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary mb-4"></div>
                <p className="text-slate-400 font-medium">Loading subscriber list...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Newsletter Subscribers</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your mailing list and export data for marketing campaigns.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExportCSV}
                        disabled={subscribers.length === 0}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{subscribers.length} Total Subscribers</span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Subscribed</th>
                                <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {filteredSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium">
                                        No subscribers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-slate-500">
                                                {sub.subscribedAt?.seconds ? new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(sub.id, sub.email)}
                                                className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                                title="Remove Subscriber"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSubscribers;
