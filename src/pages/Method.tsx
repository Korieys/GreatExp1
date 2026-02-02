
import { motion } from 'framer-motion';
import { Layers, Target, Heart, ShieldCheck, Activity, Zap, Star } from 'lucide-react';

const Method = () => {
    const pillars = [
        {
            title: 'Neuro-Clinical Rigor',
            icon: <Activity className="w-8 h-8" />,
            text: 'Our interventions are grounded in the latest neuro-scientific research, ensuring that every session is clinically valid and effective.'
        },
        {
            title: 'Systemic Integration',
            icon: <Layers className="w-8 h-8" />,
            text: 'We look beyond the individual, integrating family systems and school environments into the therapeutic equation.'
        },
        {
            title: 'Human-Centric Care',
            icon: <Heart className="w-8 h-8" />,
            text: 'Compassion is our core priority. We build trust-based relationships that allow children to feel safe while they grow.'
        },
        {
            title: 'Outcome Excellence',
            icon: <Target className="w-8 h-8" />,
            text: 'We measure success through tangible improvements in quality of life, using data to refine and evolve our approach.'
        }
    ];

    return (
        <div className="pt-32 pb-40 overflow-hidden">
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
                    <div className="space-y-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Philosophy</h2>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                            The Great <br />
                            <span className="font-serif italic font-light text-primary">Expectations Way.</span>
                        </h1>
                        <p className="text-2xl text-slate-500 font-light leading-relaxed italic">
                            "We believe that every child's development is a masterpiece in progress, requiring both precision tools and a gentle hand."
                        </p>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[3rem] md:rounded-[5rem] overflow-hidden rotate-3 shadow-2xl relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1200"
                                alt="Therapeutic Connection"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 rounded-[3rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 border border-transparent hover:border-slate-100 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg mb-8 group-hover:scale-110 transition-transform">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-4">{pillar.title}</h3>
                            <p className="text-slate-500 text-sm font-light leading-relaxed">
                                {pillar.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Innovation Section */}
            <section className="mt-40 py-32 bg-slate-950 text-white rounded-[5rem] mx-8 relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-12 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                            <Zap className="w-4 h-4 fill-primary" /> Future-First Clinical Practice
                        </div>
                        <h2 className="text-4xl md:text-7xl font-light tracking-tight leading-none">
                            Neuro-innovation <br />
                            <span className="italic font-serif text-secondary">meets heart.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-light leading-relaxed">
                            We leverage cutting-edge diagnostic tools and evidence-based methodologies to create a map of progress that is as unique as your child.
                        </p>
                        <div className="flex flex-wrap gap-6 md:gap-8">
                            <div className="space-y-2">
                                <p className="text-2xl md:text-3xl font-black text-white">15+</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Years Clinical Leadership</p>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden sm:block" />
                            <div className="space-y-2">
                                <p className="text-2xl md:text-3xl font-black text-white">92%</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Positive Outcome Rate</p>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden sm:block" />
                            <div className="space-y-2">
                                <p className="text-2xl md:text-3xl font-black text-white">1:1</p>
                                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Personalized Care Ratio</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6 h-auto min-h-[400px] lg:h-[500px]">
                        <div className="space-y-6">
                            <div className="h-2/3 bg-white/5 rounded-[3rem] border border-white/10 p-8 flex items-end">
                                <ShieldCheck className="w-12 h-12 text-primary opacity-50" />
                            </div>
                            <div className="h-1/3 bg-primary/20 rounded-[3rem] border border-primary/30" />
                        </div>
                        <div className="space-y-6 pt-12">
                            <div className="h-1/3 bg-secondary/20 rounded-[3rem] border border-secondary/30" />
                            <div className="h-2/3 bg-white/5 rounded-[3rem] border border-white/10 p-8">
                                <Star className="w-12 h-12 text-secondary opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Method;
