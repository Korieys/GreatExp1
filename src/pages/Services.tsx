import { motion } from 'framer-motion';
import {
    Heart,
    Users,
    MessageCircle,
    Accessibility,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';

const Services = () => {
    const serviceCategories = [
        {
            title: 'Pediatric Development',
            icon: <Heart className="w-10 h-10" />,
            description: 'Comprehensive developmental support focusing on social-emotional growth, neuro-agility, and behavioral resilience.',
            features: [
                'Developmental Screenings',
                'Social Skills Training',
                'Behavioral Intervention Plans',
                'Play-Based Therapy'
            ],
            color: 'bg-blue-500'
        },
        {
            title: 'Speech & Language',
            icon: <MessageCircle className="w-10 h-10" />,
            description: 'Sophisticated communication therapy addressing articulation, language processing, and receptive communication.',
            features: [
                'Articulation Assessment',
                'Language Processing Support',
                'AAC Implementation',
                'Pragmatic Language Groups'
            ],
            color: 'bg-primary'
        },
        {
            title: 'Occupational Therapy',
            icon: <Accessibility className="w-10 h-10" />,
            description: 'Specialized support for sensory processing, motor coordination, and daily living skills.',
            features: [
                'Sensory Integration Therapy',
                'Fine Motor Skill Development',
                'Visual-Motor Integration',
                'Self-Care Independence'
            ],
            color: 'bg-secondary'
        },
        {
            title: 'Family Coaching',
            icon: <Users className="w-10 h-10" />,
            description: 'Empowering caregivers with evidence-based strategies to foster a supportive and thriving home ecosystem.',
            features: [
                'Parent Consultation',
                'Family Systems Support',
                'Caregiver Workshops',
                'Home Modification Guidance'
            ],
            color: 'bg-slate-900'
        }
    ];

    return (
        <div className="pt-32 pb-40">
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="space-y-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Clinical Specializations</h2>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                            Compassionate <br />
                            <span className="font-serif italic font-light text-primary">Expertise.</span>
                        </h1>
                    </div>
                    <p className="text-xl text-slate-500 font-light leading-relaxed border-l-2 border-slate-100 pl-10">
                        We provide a multi-disciplinary ecosystem of care, ensuring that every therapeutic pathway is integrated, cohesive, and centered on the child's unique potential.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {serviceCategories.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                        >
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 text-white shadow-xl ${service.color} transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                                {service.icon}
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6">{service.title}</h3>
                            <p className="text-slate-500 text-lg font-light leading-relaxed mb-10">
                                {service.description}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                {service.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        <span className="text-sm font-bold text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-5 rounded-2xl bg-slate-50 group-hover:bg-primary group-hover:text-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                Explore Pathway <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Process Section */}
            <section className="mt-40 bg-slate-50 py-32 overflow-hidden relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-40 -top-40 w-96 h-96 border-4 border-primary/10 rounded-full border-dashed"
                />

                <div className="max-w-[1400px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">The Journey to Success</h2>
                        <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Your Integrated <span className="font-serif italic font-light text-primary">Care Cycle.</span></h3>
                    </div>

                    <div className="grid md:grid-cols-4 gap-12 relative">
                        {[
                            { step: '01', title: 'Consultation', text: 'Initial intake with lead clinicians to understand goals.' },
                            { step: '02', title: 'Assessment', text: 'Multi-disciplinary evaluation using standard metrics.' },
                            { step: '03', title: 'Intervention', text: 'Targeted therapeutic pathways with weekly goals.' },
                            { step: '04', title: 'Evolution', text: 'Refinement and outcome tracking for long-term health.' }
                        ].map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="text-6xl md:text-8xl font-black text-slate-200/50 mb-6 transition-colors group-hover:text-primary/20">{step.step}</div>
                                <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
                                <p className="text-sm text-slate-500 font-light leading-relaxed px-4">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
