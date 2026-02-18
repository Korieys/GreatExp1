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
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Services</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400 font-medium">Loading services...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden p-8 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                    {service.category}
                                </span>
                                <span className="font-black text-primary text-lg">{service.price}</span>
                            </div>

                            <h3 className="font-black text-2xl text-slate-900 mb-4 tracking-tight">{service.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 font-light">{service.description}</p>

                            <div className="flex justify-end gap-2 pt-6 border-t border-slate-50">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id!)}
                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card (Empty State) */}
                    <button
                        onClick={handleAddNew}
                        className="rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group h-full min-h-[300px]"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-4 transition-colors shadow-sm">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">Add New Service</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
