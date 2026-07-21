import { useEffect, useState } from 'react';
import type { UserProfile } from '../types/user';
import { userService } from '../services/userService';
import { Search, Mail, Calendar, Edit2, Trash2, Save, X, ArrowUpDown, Filter, Users, Award } from 'lucide-react';

const AdminPatients = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Sort and Filter States
    const [sortField, setSortField] = useState<'name' | 'email' | 'date' | 'role'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [roleFilter, setRoleFilter] = useState<'all' | 'patient' | 'practitioner' | 'admin'>('all');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ firstName: string, lastName: string, role: UserProfile['role'] }>({ firstName: '', lastName: '', role: 'patient' });

    const handleEdit = (user: UserProfile) => {
        setEditingId(user.uid);
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            role: user.role || 'patient'
        });
    };

    const handleSave = async (uid: string) => {
        try {
            await userService.updateUser(uid, editForm);
            setUsers(users.map(u => u.uid === uid ? { ...u, ...editForm } : u));
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Failed to update user");
        }
    };

    const handleDelete = async (uid: string) => {
        if (!window.confirm("Are you sure you want to delete this patient permanently?")) return;
        try {
            await userService.deleteUser(uid);
            setUsers(users.filter(u => u.uid !== uid));
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user");
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await userService.getAll();
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleSort = (field: 'name' | 'email' | 'date' | 'role') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedAndFilteredUsers = [...users]
        .filter(user => {
            const matchesSearch =
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => {
            let valA: any = '';
            let valB: any = '';

            if (sortField === 'name') {
                valA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
                valB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
            } else if (sortField === 'email') {
                valA = a.email.toLowerCase();
                valB = b.email.toLowerCase();
            } else if (sortField === 'date') {
                valA = a.createdAt?.seconds || 0;
                valB = b.createdAt?.seconds || 0;
            } else if (sortField === 'role') {
                valA = a.role || '';
                valB = b.role || '';
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const totalPatients = users.filter(u => u.role === 'patient').length;
    const totalPractitioners = users.filter(u => u.role === 'practitioner').length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Directory</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Manage user roles, medical practitioners, and patient profiles.</p>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Registered Patients</span>
                    <span className="text-3xl font-black text-slate-900">{totalPatients}</span>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Users className="w-24 h-24 text-slate-900" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Practitioners</span>
                    <span className="text-3xl font-black text-slate-900">{totalPractitioners}</span>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Award className="w-24 h-24 text-slate-900" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-2 relative overflow-hidden group">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Administrators</span>
                    <span className="text-3xl font-black text-slate-900">{totalAdmins}</span>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Mail className="w-24 h-24 text-slate-900" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white p-12 rounded-3xl text-center shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading patient directory...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Search & Filters */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm font-medium"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
                            </span>
                            <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                                {['all', 'patient', 'practitioner', 'admin'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setRoleFilter(role as any)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${
                                            roleFilter === role
                                                ? 'bg-white text-primary shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        {role}s
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-slate-700 transition-colors uppercase tracking-widest font-black">
                                            Details {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                                        </button>
                                    </th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-slate-700 transition-colors uppercase tracking-widest font-black">
                                            Contact {sortField === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                                        </button>
                                    </th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-slate-700 transition-colors uppercase tracking-widest font-black">
                                            Joined Since {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                                        </button>
                                    </th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <button onClick={() => handleSort('role')} className="flex items-center gap-1 hover:text-slate-700 transition-colors uppercase tracking-widest font-black">
                                            System Role {sortField === 'role' ? (sortDirection === 'asc' ? '↑' : '↓') : <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                                        </button>
                                    </th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {sortedAndFilteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium">
                                            No user records found matching the filters.
                                        </td>
                                    </tr>
                                ) : sortedAndFilteredUsers.map((user) => (
                                    <tr key={user.uid} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-lg border border-slate-200 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                        {user.firstName ? user.firstName[0] : user.email[0].toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-5">
                                                    <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        ID: {user.uid.slice(0, 8)}
                                                    </div>
                                                    {editingId === user.uid ? (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={editForm.firstName}
                                                                onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                                                                className="w-24 px-2 py-1 text-sm border rounded outline-none focus:border-primary"
                                                                placeholder="First Name"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={editForm.lastName}
                                                                onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                                                                className="w-24 px-2 py-1 text-sm border rounded outline-none focus:border-primary"
                                                                placeholder="Last Name"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="text-base font-bold text-slate-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 text-slate-400">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-slate-500">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            {editingId === user.uid ? (
                                                <select
                                                    value={editForm.role}
                                                    onChange={e => setEditForm({ ...editForm, role: e.target.value as UserProfile['role'] })}
                                                    className="px-2 py-1 text-sm border rounded bg-white outline-none focus:border-primary font-bold text-slate-700"
                                                >
                                                    <option value="patient">Patient</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="practitioner">Practitioner</option>
                                                </select>
                                            ) : (
                                                <span className={`px-4 py-1.5 inline-flex text-[10px] uppercase tracking-widest font-black rounded-full ${
                                                    user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    user.role === 'practitioner' ? 'bg-primary/10 text-primary border border-primary/20' : 
                                                    'bg-slate-50 text-slate-600 border border-slate-100'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {editingId === user.uid ? (
                                                    <>
                                                        <button onClick={() => handleSave(user.uid)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Save">
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Cancel">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEdit(user)} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shadow-sm border border-slate-100" title="Edit">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(user.uid)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm border border-red-100/50" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPatients;
