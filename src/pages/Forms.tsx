import { motion } from 'framer-motion';
import { ExternalLink, ClipboardCheck, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Forms = () => {
    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Patient Forms | Great Expectations"
                description="Complete your intake paperwork securely online."
                keywords="forms, intake, patient forms, secure, hipaa, valant"
                url="https://greatexpectations.clinic/forms"
            />
            <section className="max-w-[1200px] mx-auto px-8">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Patient <span className="font-serif italic font-light text-primary">Intake.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        We have streamlined our intake process. Please complete your registration and intake forms securely online through our patient portal.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 p-10 md:p-16 rounded-[3rem] border border-slate-200/50 text-center shadow-xl shadow-slate-900/5"
                    >
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ClipboardCheck className="w-12 h-12 text-primary" />
                        </div>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-6">Secure Online Intake</h2>
                        <p className="text-slate-600 mb-12 text-lg leading-relaxed max-w-xl mx-auto">
                            To provide you with the best possible care, we use a secure, HIPAA-compliant patient intake process. Clicking the button below will take you to our dedicated prospective patient portal.
                        </p>

                        <a 
                            href="https://valant.io/prospectivepatient/GreatExpectationsTherapeutic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-4 w-full sm:w-auto px-12 py-6 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-1 transition-all group"
                        >
                            <span>Start Intake Form</span>
                            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>

                        <div className="mt-14 flex items-center justify-center gap-3 text-sm text-slate-500 font-bold bg-white/60 py-4 px-6 rounded-2xl border border-slate-200/50 inline-flex mx-auto">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                            <span>100% Secure & HIPAA Compliant</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Forms;

