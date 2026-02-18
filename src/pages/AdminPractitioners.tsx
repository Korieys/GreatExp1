import { useEffect, useState } from 'react';
import { practitionerService } from '../services/practitionerService';
import type { Practitioner } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PractitionerForm from '../components/admin/PractitionerForm';


const AdminPractitioners = () => {
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPractitioner, setEditingPractitioner] = useState<Practitioner | null>(null);

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

    useEffect(() => {
        loadPractitioners();
    }, []);

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

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Practitioners</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    Add Practitioner
                </button>
            </div>

            {
                loading ? (
                    <div className="text-center py-12 text-slate-400 font-medium">Loading team...</div>
                ) : (
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
                )
            }
        </div >
    );
};

export default AdminPractitioners;
