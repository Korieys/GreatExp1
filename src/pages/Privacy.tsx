import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="pt-32 pb-40">
            <section className="max-w-[1000px] mx-auto px-8">
                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 mx-auto bg-slate-100 rounded-3xl flex items-center justify-center text-slate-900 mb-8"
                    >
                        <ShieldCheck className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                        Privacy & <span className="font-serif italic font-light text-primary">Compliance.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        We are committed to protecting your personal health information and ensuring your privacy rights are respected.
                    </p>
                </div>

                <div className="space-y-12">
                    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 text-primary rounded-xl">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">HIPAA Notice of Privacy Practices</h2>
                        </div>
                        <div className="prose prose-slate prose-lg text-slate-500 font-light">
                            <p>
                                THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
                            </p>
                            <h3 className="text-slate-900 font-bold mt-8 mb-4">Your Rights</h3>
                            <ul className="space-y-2 list-disc pl-5">
                                <li>Get a copy of your paper or electronic medical record</li>
                                <li>Correct your paper or electronic medical record</li>
                                <li>Request confidential communication</li>
                                <li>Ask us to limit the information we share</li>
                                <li>Get a list of those with whom we’ve shared your information</li>
                                <li>Get a copy of this privacy notice</li>
                                <li>Choose someone to act for you</li>
                                <li>File a complaint if you believe your privacy rights have been violated</li>
                            </ul>

                            <h3 className="text-slate-900 font-bold mt-8 mb-4">Our Responsibilities</h3>
                            <ul className="space-y-2 list-disc pl-5">
                                <li>We are required by law to maintain the privacy and security of your protected health information.</li>
                                <li>We will let you know promptly if a breach occurs that may have compromised the privacy or security of your information.</li>
                                <li>We must follow the duties and privacy practices described in this notice and give you a copy of it.</li>
                                <li>We will not use or share your information other than as described here unless you tell us we can in writing.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
