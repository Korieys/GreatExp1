import { useEffect, useState } from 'react';
import { practitionerService } from '../services/practitionerService';
import type { Practitioner } from '../types';
import { Plus, Edit2, Trash2, Shield, Users as UsersIcon, Check } from 'lucide-react';
import PractitionerForm from '../components/admin/PractitionerForm';
import { userService } from '../services/userService';
import type { UserProfile } from '../types/user';


const AdminPractitioners = () => {
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [staff, setStaff] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);
    const [activeTab, setActiveTab] = useState<'profiles' | 'permissions'>('profiles');

    const loadPractitioners = async () => {
        setLoading(true);
        try {
            const data = await practitionerService.getAll();
            setPractitioners(data);
        } catch (error) {
            console.error("Failed to load practitioners", error);
        } finally {
            setLoading(false);
        }
    };

    const loadStaff = async () => {
        setLoading(true);
        try {
            const users = await userService.getAll();
            setStaff(users.filter(u => u.role === 'admin'));
        } catch (error) {
            console.error("Failed to load staff", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'profiles') loadPractitioners();
        if (activeTab === 'permissions') loadStaff();
    }, [activeTab]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this practitioner?')) {
            await practitionerService.delete(id);
            loadPractitioners();
        }
    };

    const handleEdit = (practitioner: Practitioner) => {
        setEditingPractitioner(practitioner);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingPractitioner(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async () => {
        setIsFormOpen(false);
        setEditingPractitioner(null);
        await loadPractitioners();
    };

    if (isFormOpen) {
        return (
            <PractitionerForm
                initialData={editingPractitioner || undefined}
                onSave={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
            />
        );
    }

    const availablePermissions: ('content' | 'users' | 'appointments' | 'blog' | 'settings' | 'inquiries')[] = ['content', 'users', 'appointments', 'blog', 'settings', 'inquiries'];

    const togglePermission = async (userId: string, permission: 'content' | 'users' | 'appointments' | 'blog' | 'settings' | 'inquiries', currentPerms: ('content' | 'users' | 'appointments' | 'blog' | 'settings' | 'inquiries')[] = []) => {
        const newPerms = currentPerms.includes(permission)
            ? currentPerms.filter(p => p !== permission)
            : [...currentPerms, permission];

        try {
            await userService.updateUser(userId, { permissions: newPerms as any });
            setStaff(staff.map(s => s.uid === userId ? { ...s, permissions: newPerms as any } : s));
        } catch (error) {
            alert('Failed to update permissions');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage public practitioner profiles and internal staff permissions.</p>
                </div>
                {activeTab === 'profiles' && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add Profile
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('profiles')}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'profiles' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <UsersIcon className="w-4 h-4" /> Public Profiles
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`flex items-center gap-2 px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'permissions' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Shield className="w-4 h-4" /> Staff Privileges
                </button>
            </div>

            {
                loading ? (
                    <div className="text-center py-12 text-slate-400 font-medium">Loading team...</div>
                ) : activeTab === 'profiles' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {practitioners.map((practitioner) => (
                            <div key={practitioner.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-w-16 aspect-h-9 bg-slate-100 h-64 overflow-hidden relative">
                                    {practitioner.imageUrl ? (
                                        <img src={practitioner.imageUrl} alt={practitioner.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                            <span className="font-medium">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="font-black text-2xl text-white mb-1">{practitioner.name}</h3>
                                        <p className="text-white/90 text-sm font-bold bg-primary/20 backdrop-blur-sm inline-block px-3 py-1 rounded-lg border border-white/10">{practitioner.role}</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 font-light">{practitioner.bio}</p>

                                    <div className="flex justify-end gap-2 pt-6 border-t border-slate-50">
                                        <button
                                            onClick={() => handleEdit(practitioner)}
                                            className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(practitioner.id!)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Staff</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Granular Capabilities</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {staff.map(user => (
                                    <tr key={user.uid} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
                                                    {user.firstName?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                                    <p className="text-sm font-medium text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                            {!user.permissions && (
                                                <span className="mt-2 inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-md">Super Admin (All Access)</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2 max-w-lg">
                                                {availablePermissions.map(perm => {
                                                    const hasPerm = (!user.permissions) || user.permissions.includes(perm);
                                                    return (
                                                        <button
                                                            key={perm}
                                                            onClick={() => togglePermission(user.uid, perm, user.permissions)}
                                                            className={`px-3 py-1.5 flex items-center gap-2 rounded-lg text-xs font-bold capitalize transition-all border ${hasPerm ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-400 border-slate-200'}`}
                                                        >
                                                            {hasPerm && <Check className="w-3 h-3" />} {perm}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    );
};

export default AdminPractitioners;
