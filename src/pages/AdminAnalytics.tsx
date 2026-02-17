import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Calendar, TrendingUp, DollarSign } from 'lucide-react';

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
        { title: 'Total Patients', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Pending Requests', value: stats.pendingAppointments, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { title: 'Completed Sessions', value: stats.completedAppointments, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' }
    ];

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Growth Insights</h2>
                <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                    Chart Placeholder (Requires Chart.js or Recharts)
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
