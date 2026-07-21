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
    const [chartData, setChartData] = useState<{ label: string, value: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

                // Compute last 6 months list and group bookings
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const now = new Date();
                const last6Months: string[] = [];
                const monthlyCounts: { [key: string]: number } = {};

                for (let i = 5; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthLabel = months[d.getMonth()] + ' ' + String(d.getFullYear()).slice(-2);
                    last6Months.push(monthLabel);
                    monthlyCounts[monthLabel] = 0;
                }

                allAppointmentsSnap.forEach(docSnap => {
                    const data = docSnap.data();
                    if (data.date) {
                        try {
                            const appDate = new Date(data.date);
                            if (!isNaN(appDate.getTime())) {
                                const mLabel = months[appDate.getMonth()] + ' ' + String(appDate.getFullYear()).slice(-2);
                                if (monthlyCounts[mLabel] !== undefined) {
                                    monthlyCounts[mLabel]++;
                                }
                            }
                        } catch (e) {
                            // Date parse error
                        }
                    }
                });

                const chartPoints = last6Months.map(month => ({
                    label: month,
                    value: monthlyCounts[month]
                }));

                setChartData(chartPoints);
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

    // SVG chart configuration
    const svgWidth = 700;
    const svgHeight = 260;
    const paddingX = 60;
    const paddingY = 40;

    const chartWidth = svgWidth - paddingX * 2;
    const chartHeight = svgHeight - paddingY * 2;

    const finalChartData = chartData.map((d, i) => {
        const allZero = chartData.every(x => x.value === 0);
        return {
            label: d.label,
            value: allZero ? [3, 5, 4, 8, 6, 9][i] : d.value,
            isMock: allZero
        };
    });

    const maxVal = Math.max(...finalChartData.map(d => d.value), 1);
    const yMax = Math.ceil(maxVal * 1.25);

    const getX = (index: number) => {
        if (finalChartData.length <= 1) return paddingX;
        return paddingX + (index * (chartWidth / (finalChartData.length - 1)));
    };

    const getY = (value: number) => {
        const ratio = value / yMax;
        return paddingY + chartHeight - (ratio * chartHeight);
    };

    let linePath = '';
    let areaPath = '';

    if (finalChartData.length > 0) {
        linePath = `M ${getX(0)} ${getY(finalChartData[0].value)}`;
        for (let i = 1; i < finalChartData.length; i++) {
            linePath += ` L ${getX(i)} ${getY(finalChartData[i].value)}`;
        }

        areaPath = `M ${getX(0)} ${paddingY + chartHeight}`;
        areaPath += ` L ${getX(0)} ${getY(finalChartData[0].value)}`;
        for (let i = 1; i < finalChartData.length; i++) {
            areaPath += ` L ${getX(i)} ${getY(finalChartData[i].value)}`;
        }
        areaPath += ` L ${getX(finalChartData.length - 1)} ${paddingY + chartHeight} Z`;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Growth Insights</h2>
                            <p className="text-sm text-slate-500 font-medium tracking-wide">Monthly booking trend for the last 6 months.</p>
                        </div>
                    </div>
                    {finalChartData.length > 0 && finalChartData[0].isMock && (
                        <span className="bg-amber-50 border border-amber-100 text-amber-700 font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider animate-pulse self-start sm:self-center">
                            ⚠️ Displaying illustrative target curves (No live data yet)
                        </span>
                    )}
                </div>

                <div className="w-full overflow-x-auto">
                    <div className="min-w-[640px] relative">
                        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#61B0E2" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#61B0E2" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#61B0E2" />
                                    <stop offset="100%" stopColor="#FFC92B" />
                                </linearGradient>
                            </defs>

                            {/* Y axis helper grids */}
                            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                                const val = Math.round(yMax * r);
                                const yPos = getY(val);
                                return (
                                    <g key={i} className="opacity-40">
                                        <line
                                            x1={paddingX}
                                            y1={yPos}
                                            x2={svgWidth - paddingX}
                                            y2={yPos}
                                            stroke="#E2E8F0"
                                            strokeDasharray="4,4"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={paddingX - 10}
                                            y={yPos + 4}
                                            textAnchor="end"
                                            fontSize="9"
                                            fontWeight="bold"
                                            fill="#94A3B8"
                                            className="font-sans"
                                        >
                                            {val}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* X Axis labels */}
                            {finalChartData.map((d, i) => (
                                <text
                                    key={i}
                                    x={getX(i)}
                                    y={svgHeight - paddingY + 20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="black"
                                    fill="#64748B"
                                    className="font-sans"
                                >
                                    {d.label}
                                </text>
                            ))}

                            {/* Area Fill */}
                            {areaPath && (
                                <path
                                    d={areaPath}
                                    fill="url(#areaGrad)"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {/* Line path */}
                            {linePath && (
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke="url(#lineGrad)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {/* Interactive vertical hover overlays */}
                            {finalChartData.map((d, i) => (
                                <g key={i}>
                                    <rect
                                        x={getX(i) - (chartWidth / (finalChartData.length - 1)) / 2}
                                        y={paddingY}
                                        width={chartWidth / (finalChartData.length - 1)}
                                        height={chartHeight}
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                    <circle
                                        cx={getX(i)}
                                        cy={getY(d.value)}
                                        r={hoveredIndex === i ? 6 : 4}
                                        fill={hoveredIndex === i ? '#FFC92B' : '#61B0E2'}
                                        stroke="#FFFFFF"
                                        strokeWidth="2.5"
                                        className="transition-all duration-150 pointer-events-none shadow"
                                    />
                                </g>
                            ))}

                            {/* Hover Tooltip box */}
                            {hoveredIndex !== null && (
                                <g className="pointer-events-none transition-all duration-200">
                                    <line
                                        x1={getX(hoveredIndex)}
                                        y1={paddingY}
                                        x2={getX(hoveredIndex)}
                                        y2={paddingY + chartHeight}
                                        stroke="#61B0E2"
                                        strokeWidth="1.5"
                                        strokeDasharray="4,4"
                                    />
                                    <rect
                                        x={getX(hoveredIndex) - 50}
                                        y={getY(finalChartData[hoveredIndex].value) - 40}
                                        width="100"
                                        height="30"
                                        rx="8"
                                        fill="#0F172A"
                                        className="shadow-xl"
                                    />
                                    <text
                                        x={getX(hoveredIndex)}
                                        y={getY(finalChartData[hoveredIndex].value) - 20}
                                        fill="#FFFFFF"
                                        fontSize="10"
                                        fontWeight="black"
                                        textAnchor="middle"
                                        className="font-sans"
                                    >
                                        {finalChartData[hoveredIndex].value} {finalChartData[hoveredIndex].isMock ? 'Target' : 'Bookings'}
                                    </text>
                                </g>
                            )}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
