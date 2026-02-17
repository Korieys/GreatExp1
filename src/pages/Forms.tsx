import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { patientFormService } from '../services/patientFormService';
import { useAuth } from '../contexts/AuthContext';

const Forms = () => {
    const { currentUser } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        patientName: '',
        documentType: 'Driver\'s License / ID'
    });
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploadStatus('uploading');
        setError('');

        try {
            await patientFormService.uploadPatientForm(file, {
                ...formData,
                uploadedBy: currentUser ? currentUser.uid : null
            });
            setUploadStatus('success');
        } catch (err) {
            console.error(err);
            setUploadStatus('error');
            setError('Failed to upload document. Please try again.');
        }
    };
    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Patient Forms | Great Expectations"
                description="Download intake paperwork or securely upload identification and insurance documents."
                keywords="forms, intake, patient forms, upload, download, secure, hipaa"
            />
            <section className="max-w-[1200px] mx-auto px-8">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Patient <span className="font-serif italic font-light text-primary">Forms.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Securely download intake paperwork or upload your identification and insurance documents.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Download Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/20">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Intake Packets</h2>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Download & Complete</p>
                            </div>
                        </div>

                        {[
                            'New Patient Intake - Adult',
                            'New Patient Intake - Child/Adolescent',
                            'Consent to Treat',
                            'Telehealth Consent',
                            'Release of Information'
                        ].map((form, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all group cursor-pointer"
                            >
                                <span className="font-bold text-slate-700">{form}</span>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Download className="w-5 h-5" />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upload Section */}
                    <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Secure Upload</h2>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">ID & Insurance Cards</p>
                            </div>
                        </div>

                        {uploadStatus === 'success' ? (
                            <div className="bg-green-100 border border-green-200 text-green-800 rounded-2xl p-8 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                                <h3 className="text-xl font-bold mb-2">Upload Complete!</h3>
                                <p>Your documents have been securely transmitted to our intake team.</p>
                                <button
                                    onClick={() => {
                                        setUploadStatus('idle');
                                        setFile(null);
                                        setFormData({ patientName: '', documentType: 'Driver\'s License / ID' });
                                    }}
                                    className="mt-6 text-sm font-bold underline hover:text-primary transition-colors"
                                >
                                    Upload another document
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleUpload}>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Patient Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.patientName}
                                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Full Legal Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Document Type</label>
                                    <select
                                        value={formData.documentType}
                                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                                        className="w-full h-14 px-6 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-slate-600"
                                    >
                                        <option>Driver's License / ID</option>
                                        <option>Insurance Card (Front & Back)</option>
                                        <option>Completed Intake Forms</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div
                                    className={`p-8 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer group relative
                                        ${file ? 'border-primary bg-primary/5' : 'border-slate-300 bg-white/50 hover:bg-white hover:border-primary/50'}`}
                                >
                                    <input
                                        type="file"
                                        required
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors ${file ? 'text-primary' : 'text-slate-300 group-hover:text-primary'}`} />
                                    <p className="text-slate-500 font-medium text-sm">
                                        {file ? file.name : "Drag and drop details here, or click to browse"}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">PDF, JPG, PNG up to 10MB</p>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={uploadStatus === 'uploading' || !file}
                                    className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {uploadStatus === 'uploading' ? (
                                        <span>Encrypting & Uploading...</span>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            Secure Submit
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                                    256-bit SSL Encrypted Transmission
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Forms;
