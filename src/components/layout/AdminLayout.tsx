import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, FileText, Activity, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', path: '/admin/analytics', icon: Activity },
        { name: 'Patients', path: '/admin/patients', icon: UserPlus },
        { name: 'Practitioners', path: '/admin/practitioners', icon: Users },
        { name: 'Services', path: '/admin/services', icon: Settings },
        { name: 'Blog', path: '/admin/blog', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 text-white hidden md:flex flex-col fixed h-full z-10 transition-all duration-300 shadow-xl">
                <div className="p-8 border-b border-slate-800/50">
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">
                        Great <span className="text-primary">Exp.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 w-full transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header (visible on small screens) */}
            <div className="md:hidden fixed w-full bg-slate-950 text-white z-20 border-b border-slate-800 p-4 flex justify-between items-center shadow-lg">
                <div>
                    <h1 className="text-lg font-black tracking-tight">Great <span className="text-primary">Exp.</span></h1>
                </div>
                {/* Mobile menu toggle would go here */}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-24 md:pt-10 max-w-[1600px] mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
