import { AlertTriangle, FileWarning } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Grievance = () => {
    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Grievance Procedure | Great Expectations"
                description="Submit a formal grievance or complaint. We take all concerns seriously and will address them immediately."
                keywords="grievance, complaint, feedback, concern, report"
            />
            <section className="max-w-3xl mx-auto px-8">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
                        Grievance <span className="font-serif italic font-light text-slate-400">Procedure.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                        We take all concerns seriously. If you have a formal complaint, please submit it below so we can address it immediately.
                    </p>
                </div>

                <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-red-50 shadow-xl shadow-red-500/5">
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Full Name</label>
                                <input type="text" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-red-200 outline-none transition-all" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Phone Number</label>
                                <input type="tel" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-red-200 outline-none transition-all" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Date of Incident</label>
                            <input type="date" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-red-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Description of Grievance</label>
                            <textarea className="w-full h-40 px-6 py-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none" placeholder="Please provide specific details..." required></textarea>
                        </div>

                        <button className="w-full py-5 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                            Submit Formal Complaint <FileWarning className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Grievance;
