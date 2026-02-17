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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Practitioners</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Practitioner
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practitioners.map((practitioner) => (
                        <div key={practitioner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 h-48 overflow-hidden relative">
                                {practitioner.imageUrl ? (
                                    <img src={practitioner.imageUrl} alt={practitioner.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-gray-900">{practitioner.name}</h3>
                                <p className="text-indigo-600 text-sm font-medium mb-2">{practitioner.role}</p>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{practitioner.bio}</p>

                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                    <button
                                        onClick={() => handleEdit(practitioner)}
                                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(practitioner.id!)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPractitioners;
