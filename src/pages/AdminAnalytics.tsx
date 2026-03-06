import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Calendar, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Fetch Users Count
                const usersCount = await userService.getCount();

                // Fetch Appointments Stats
                const appointmentsRef = collection(db, 'appointments');
                const allAppointmentsSnap = await getDocs(appointmentsRef);
                const totalAppointments = allAppointmentsSnap.size;

                const pendingQuery = query(appointmentsRef, where('status', '==', 'pending'));
                const pendingSnap = await getDocs(pendingQuery);
                const pendingAppointments = pendingSnap.size;

                const completedQuery = query(appointmentsRef, where('status', '==', 'completed'));
                const completedSnap = await getDocs(completedQuery);
                const completedAppointments = completedSnap.size;

                setStats({
                    totalUsers: usersCount,
                    totalAppointments,
                    pendingAppointments,
                    completedAppointments
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const cards = [
        { title: 'Total Patients', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
        { title: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
        { title: 'Pending Requests', value: stats.pendingAppointments, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
        { title: 'Completed Sessions', value: stats.completedAppointments, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary mb-4"></div>
                <p className="text-slate-400 font-medium">Crunching the numbers...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Overview</h1>
                <span className="bg-white border border-slate-200 text-slate-600 shadow-sm text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Live Data
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${card.bg} border transition-transform group-hover:scale-110`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{card.title}</p>
                        </div>
                        <div className={`absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity`}>
                            <card.icon className="w-32 h-32" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Growth Insights</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Monthly patient acquisition and retention metrics.</p>
                    </div>
                </div>

                <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <BarChart2 className="w-8 h-8 mb-3 opacity-20" />
                    <span className="text-sm font-bold uppercase tracking-widest opacity-60">Chart Visualization Module</span>
                    <span className="text-[10px] font-medium mt-1 opacity-40">Integration Pending</span>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
