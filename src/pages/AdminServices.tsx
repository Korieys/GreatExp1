import { useEffect, useState } from 'react';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types/service';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ServiceForm from '../components/admin/ServiceForm';

const AdminServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await serviceService.getAll();
            setServices(data);
        } catch (error) {
            console.error("Failed to load services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            await serviceService.delete(id);
            loadServices();
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingService(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async () => {
        setIsFormOpen(false);
        setEditingService(null);
        await loadServices();
    };

    if (isFormOpen) {
        return (
            <ServiceForm
                initialData={editingService || undefined}
                onSave={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Services</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <span>{service.category}</span>
                                <span className="font-medium text-indigo-600">{service.price}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6">{service.description}</p>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id!)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminServices;
