import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, Star, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { practitionerService } from '../services/practitionerService';
import type { Practitioner } from '../types';

const Practitioners = () => {
    const [team, setTeam] = useState<Practitioner[]>([]);
    const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);

    useEffect(() => {
        const loadPractitioners = async () => {
            try {
                const data = await practitionerService.getAll();
                setTeam(data);
            } catch (error) {
                console.error("Failed to load practitioners", error);
            }
        };
        loadPractitioners();
    }, []);

    const getSummary = (text: string, maxLength: number = 250) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    };

    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Our Practitioners | Great Expectations"
                description="Meet our team of elite practitioners dedicated to clinical excellence and compassionate care."
                keywords="team, practitioners, psychologists, therapists, speech pathology, occupational therapy"
            />
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="text-center mb-24 space-y-6">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Clinical Team</h2>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                        Elite <span className="font-serif italic font-light text-primary">Practitioners.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Our practitioners are more than clinicians; they are partners in your family's journey, dedicated to clinical excellence and compassionate care.
                    </p>
                </div>

                <div className="grid gap-12">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden p-6 md:p-12 items-center`}
                        >
                            {/* Image side */}
                            <div className="w-full lg:w-1/3 aspect-square lg:aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative group">
                                <img src={member.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800'} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                    <div className="flex gap-4">
                                        <Award className="text-white w-6 h-6" />
                                        <Star className="text-secondary w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            {/* Content side */}
                            <div className="w-full lg:w-2/3 space-y-8">
                                <div>
                                    <div className="flex flex-wrap items-center gap-4 mb-2">
                                        <h2 className="text-4xl font-black text-slate-900">{member.name}</h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">{member.credentials}</span>
                                            <span className="px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-[9px] font-black uppercase tracking-widest">{member.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-lg font-bold text-primary italic uppercase tracking-widest text-[11px] mb-6">{member.role}</p>
                                </div>

                                <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl italic">
                                    "{member.summary || getSummary(member.bio)}"
                                </p>

                                <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                                    {member.specialties && member.specialties.map((spec, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 leading-tight">{spec}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setSelectedPractitioner(member)}
                                    className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 hover:text-primary transition-colors group"
                                >
                                    Full Clinical Profile <BookOpen className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Leadership Quote */}
            <section className="mt-40 bg-slate-950 text-white py-32 rounded-[5rem] mx-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-primary/20 blur-[100px]" />
                <div className="max-w-4xl mx-auto px-8 relative z-10 text-center space-y-12">
                    <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-8">
                        <Heart className="text-primary w-10 h-10 fill-primary/10" />
                    </div>
                    <p className="text-2xl md:text-4xl md:text-5xl font-light italic leading-tight">
                        "Clinical excellence is our baseline; human resilience is our destination. We believe every child has a unique brilliance waiting to be unlocked."
                    </p>
                    <div className="pt-10 border-t border-white/20 w-48 mx-auto">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Dr. Regan Boyd</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mt-1">Founding Partner</p>
                    </div>
                </div>
            </section>

            {/* Full Profile Modal */}
            {selectedPractitioner && (
                <Modal isOpen={!!selectedPractitioner} onClose={() => setSelectedPractitioner(null)}>
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-slate-100 pb-8">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                <img
                                    src={selectedPractitioner.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800'}
                                    alt={selectedPractitioner.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedPractitioner.name}</h2>
                                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">{selectedPractitioner.role}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">{selectedPractitioner.credentials}</span>
                                    {selectedPractitioner.status && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">{selectedPractitioner.status}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Professional Biography</h3>
                            <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap font-light text-lg">
                                {selectedPractitioner.bio}
                            </div>
                        </div>

                        {selectedPractitioner.specialties && (
                            <div className="pt-8 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Clinical Focus & Specialties</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedPractitioner.specialties.map((spec, i) => (
                                        <div key={i} className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm font-medium flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-primary" />
                                            {spec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Practitioners;
