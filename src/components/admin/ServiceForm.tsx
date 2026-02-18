import React, { useState } from 'react';
import type { Service } from '../../types/service';
import { serviceService } from '../../services/serviceService';
import { ArrowLeft, Plus, Trash } from 'lucide-react';

interface ServiceFormProps {
    initialData?: Service;
    onSave: () => void;
    onCancel: () => void;
}

const CATEGORIES = ['Clinical', 'Coaching', 'Assessment', 'Other'];

const ServiceForm = ({ initialData, onSave, onCancel }: ServiceFormProps) => {
    const [formData, setFormData] = useState<Partial<Service>>({
        title: '',
        description: '',
        duration: '',
        price: '',
        category: 'Clinical',
        features: [],
        ...initialData
    });
    const [featureInput, setFeatureInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(prev.features || []), featureInput.trim()]
            }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await serviceService.update(initialData.id, formData);
            } else {
                await serviceService.create(formData as Service);
            }
            onSave();
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <button onClick={onCancel} className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <h2 className="text-lg font-bold text-gray-900">
                    {initialData ? 'Edit Service' : 'New Service'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="$150"
                                    className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="50 min"
                                    className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                required
                                className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Features (Bullet Points)</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    className="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                                    placeholder="Add a feature..."
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.features?.map((feature, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="text-sm text-gray-700">{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(!formData.features || formData.features.length === 0) && (
                                    <p className="text-sm text-gray-400 italic text-center py-4">No features added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2.5 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading && <span className="animate-spin">⏳</span>}
                        Save Service
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;
