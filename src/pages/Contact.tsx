import { Phone, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Contact = () => {
    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Contact Us | Great Expectations"
                description="Get in touch with Great Expectations. We are currently accepting new patient inquiries."
                keywords="contact, intake, appointment, consultation, location, phone, email"
            />
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-24">
                    {/* Info Side */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intake & Contact</h2>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                                Begin the <br />
                                <span className="font-serif italic font-light text-primary">Conversation.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-light leading-relaxed max-w-xl">
                                We are currently accepting new patient inquiries. Our intake desk will review your initial information and reach out for a private consultation.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direct Line</p>
                                    <p className="text-xl font-bold text-slate-900">(555) 010-8888</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Clinical Desk</p>
                                    <p className="text-xl font-bold text-slate-900">office@ge-therapeutic.com</p>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Practice HQ</p>
                                    <p className="text-xl font-bold text-slate-900 leading-snug">The Sterling Building, Suite 1400<br />Austin, Texas 78701</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden">
                            <ShieldCheck className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">HIPAA Secure Portal</p>
                                    <p className="text-sm font-bold">End-to-End Encryption Enabled</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] p-8 lg:p-16">
                        <h2 className="text-2xl font-black text-slate-900 mb-10">Initial Intake Request</h2>
                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Parent/Guardian Name</label>
                                    <input type="text" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium" placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                                    <input type="email" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium" placeholder="jane@example.com" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service of Interest</label>
                                <select className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium appearance-none">
                                    <option>Select a Pathway</option>
                                    <option>Pediatric Development</option>
                                    <option>Speech & Language</option>
                                    <option>Occupational Therapy</option>
                                    <option>Family Dynamics</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">How can we help?</label>
                                <textarea rows={6} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium resize-none" placeholder="Brief description of your child's needs..."></textarea>
                            </div>

                            <button className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group">
                                Submit Request <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>

                            <p className="text-[10px] text-center text-slate-400 font-medium">By submitting, you agree to our private clinical policy.</p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
