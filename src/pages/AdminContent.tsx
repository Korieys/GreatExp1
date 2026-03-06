import { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import type { SiteContent } from '../services/contentService';
import { Save, Loader2, Link as LinkIcon, Edit3, Globe } from 'lucide-react';

const AdminContent = () => {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await contentService.getMainContent();
            setContent(data);
        } catch (error) {
            console.error("Failed to load content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof SiteContent, value: string | boolean) => {
        if (content) {
            setContent({ ...content, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!content) return;
        setSaving(true);
        setSuccessMsg('');
        try {
            await contentService.updateMainContent(content);
            setSuccessMsg('Content updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Failed to save content", error);
            alert("Failed to save. Check console.");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !content) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Site Content Manager</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200 disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {successMsg}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-200">
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Homepage Hero</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Update the main landing area of the site.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Title Line 1</label>
                            <input
                                type="text"
                                value={content.heroTitleLine1}
                                onChange={(e) => handleChange('heroTitleLine1', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Title Line 2 (Highlight)</label>
                            <input
                                type="text"
                                value={content.heroTitleLine2}
                                onChange={(e) => handleChange('heroTitleLine2', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hero Subtitle</label>
                        <textarea
                            value={content.heroSubtitle}
                            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900 resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-200">
                        <LinkIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Contact & Status Info</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Manage clinical availability and contact details.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Clinic Status Text</label>
                            <input
                                type="text"
                                value={content.clinicStatusText}
                                onChange={(e) => handleChange('clinicStatusText', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div className="flex flex-col justify-center pt-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={content.clinicAcceptingNew}
                                        onChange={(e) => handleChange('clinicAcceptingNew', e.target.checked)}
                                    />
                                    <div className={`block w-14 h-8 rounded-full transition-colors ${content.clinicAcceptingNew ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${content.clinicAcceptingNew ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                                <span className="text-sm font-bold text-slate-700">Accepting New Patient Intakes</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
                            <input
                                type="text"
                                value={content.contactPhone}
                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={content.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">SEO & Metadata</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-wide">Manage how your site appears in Google Search.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">SEO Page Title</label>
                        <input
                            type="text"
                            value={content.seoTitle || ''}
                            onChange={(e) => handleChange('seoTitle', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            placeholder="e.g. Great Expectations | Pediatric Therapy"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">SEO Meta Description</label>
                        <textarea
                            value={content.seoDescription || ''}
                            onChange={(e) => handleChange('seoDescription', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900 resize-none"
                            placeholder="Brief description for search engine results..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;
