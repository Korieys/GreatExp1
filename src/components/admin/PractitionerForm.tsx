import React, { useState } from 'react';
import type { Practitioner, Availability } from '../../types';
import { practitionerService } from '../../services/practitionerService';
import { ArrowLeft, Upload, Plus, Trash } from 'lucide-react';

interface PractitionerFormProps {
    initialData?: Practitioner;
    onSave: () => void;
    onCancel: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PractitionerForm = ({ initialData, onSave, onCancel }: PractitionerFormProps) => {
    const [formData, setFormData] = useState<Partial<Practitioner>>({
        name: '',
        role: '',
        bio: '',
        availability: [],
        ...initialData
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const addAvailability = () => {
        setFormData(prev => ({
            ...prev,
            availability: [
                ...(prev.availability || []),
                { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true }
            ]
        }));
    };

    const updateAvailability = (index: number, field: keyof Availability, value: any) => {
        setFormData(prev => {
            const newAvailability = [...(prev.availability || [])];
            newAvailability[index] = { ...newAvailability[index], [field]: value };
            return { ...prev, availability: newAvailability };
        });
    };

    const removeAvailability = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await practitionerService.update(initialData.id, formData, file || undefined);
            } else {
                await practitionerService.create(formData as Practitioner, file || undefined);
            }
            onSave();
        } catch (error) {
            console.error("Error saving practitioner:", error);
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
                    {initialData ? 'Edit Practitioner' : 'New Practitioner'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Image Upload */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-xs">Upload Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                            <div className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="text-sm font-medium">Change Image</span>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role / Title</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. Clinical Psychologist"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2.5"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <div className="border-t border-gray-200 pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Weekly Availability</h3>
                        <button
                            type="button"
                            onClick={addAvailability}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Slot
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.availability?.map((slot, index) => (
                            <div key={index} className="flex flex-wrap items-end gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="w-40">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
                                    <select
                                        value={slot.day}
                                        onChange={(e) => updateAvailability(index, 'day', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    >
                                        {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Start</label>
                                    <input
                                        type="time"
                                        value={slot.startTime}
                                        onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div className="self-center">to</div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">End</label>
                                    <input
                                        type="time"
                                        value={slot.endTime}
                                        onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    />
                                </div>
                                <div className="flex-1 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeAvailability(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(!formData.availability || formData.availability.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No availability slots configured.</p>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading && <span className="animate-spin">⏳</span>}
                        Save Practitioner
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PractitionerForm;
