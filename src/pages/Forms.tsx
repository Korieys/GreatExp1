import { motion } from 'framer-motion';
import { FileText, Upload, Download, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Forms = () => {
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

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Patient Name</label>
                                <input type="text" className="w-full h-14 px-6 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Full Legal Name" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Document Type</label>
                                <select className="w-full h-14 px-6 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-slate-600">
                                    <option>Driver's License / ID</option>
                                    <option>Insurance Card (Front & Back)</option>
                                    <option>Completed Intake Forms</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50 text-center hover:bg-white hover:border-primary/50 transition-all cursor-pointer group">
                                <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4 group-hover:text-primary transition-colors" />
                                <p className="text-slate-500 font-medium text-sm">Drag and drop details here, or click to browse</p>
                                <p className="text-xs text-slate-400 mt-2">PDF, JPG, PNG up to 10MB</p>
                            </div>

                            <button className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                                <CheckCircle className="w-4 h-4" />
                                Secure Submit
                            </button>

                            <p className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full" />
                                256-bit SSL Encrypted Transmission
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Forms;
