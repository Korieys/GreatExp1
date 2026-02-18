import React, { useState, useEffect } from 'react';
import type { BlogPost } from '../../types/blog';
import { blogService } from '../../services/blogService';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';

interface BlogFormProps {
    initialData?: BlogPost;
    onSave: () => void;
    onCancel: () => void;
}

const CATEGORIES = ['Mental Health', 'Wellness', 'News', 'Events', 'Tips'];

const BlogForm = ({ initialData, onSave, onCancel }: BlogFormProps) => {
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Mental Health',
        tags: [],
        published: false,
        ...initialData
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.coverImage || null);
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-generate slug from title if not manually set
    useEffect(() => {
        if (!initialData && formData.title && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: prev.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ''
            }));
        }
    }, [formData.title, initialData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags?.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...(prev.tags || []), tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await blogService.update(initialData.id, formData, file || undefined);
            } else {
                await blogService.create(formData as BlogPost, file || undefined);
            }
            onSave();
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            name="published"
                            checked={formData.published}
                            onChange={handleCheckboxChange}
                            className="rounded text-primary focus:ring-primary"
                        />
                        Published
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-500 disabled:opacity-50 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
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
                        <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3 bg-slate-50"
                        />
                    </div>
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <span className="flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Change Image
                            </span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags (Press Enter)</label>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={addTag}
                            className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                            placeholder="Add tags..."
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags?.map(tag => (
                                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-primary">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-slate-400 hover:text-red-500"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        rows={2}
                        className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3"
                        placeholder="Short summary for list view..."
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Content (HTML/Markdown)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={15}
                        required
                        className="mt-1 block w-full rounded-xl border-slate-200 shadow-sm focus:border-primary focus:ring-primary border p-3 font-mono text-sm"
                        placeholder="Write your article content here..."
                    />
                </div>
            </div>
        </form>
    );
};

export default BlogForm;
