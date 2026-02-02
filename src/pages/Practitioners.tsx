
import { motion } from 'framer-motion';
import { Award, BookOpen, Heart, Star, ShieldCheck } from 'lucide-react';

const Practitioners = () => {
    const team = [
        {
            name: 'Dr. Regan Boyd',
            role: 'Owner & Lead Pediatric Psychologist',
            credentials: 'Psy.D., BCBA-D',
            status: 'Accepting New Patients',
            bio: 'Dr. Boyd is a visionary clinical leader with over 15 years of experience in pediatric development and family systems. Her approach integrates evidence-based neuro-psychology with a compassionate, human-centric focus.',
            specialties: ['Neuro-Developmental Assessment', 'Family Systems Therapy', 'Early Start Denver Model'],
            image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Sarah Chen',
            role: 'Clinical Director - Speech & Language',
            credentials: 'MS, CCC-SLP',
            status: 'Waitlist Open (Limited)',
            bio: 'Sarah leads our communication sciences department, focusing on complex articulation and social communication challenges.',
            specialties: ['Early Childhood Language', 'AAC Systems Implementation', 'Social Pragmatics'],
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Marcus Thorne',
            role: 'Lead Occupational Therapist',
            credentials: 'OTD, OTR/L',
            status: 'Consultations Open',
            bio: 'Dr. Thorne specializes in sensory integration and motor coordination, helping children navigate their worlds with confidence.',
            specialties: ['Sensory Processing Integration', 'Fine Motor Development', 'Self-Regulation Methods'],
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
        }
    ];

    return (
        <div className="pt-32 pb-40">
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
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                    "{member.bio}"
                                </p>

                                <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                                    {member.specialties.map((spec, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 leading-tight">{spec}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 hover:text-primary transition-colors group">
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
        </div>
    );
};

export default Practitioners;
