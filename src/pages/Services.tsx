import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types/service';
import {
    Heart,
    Users,
    CheckCircle2,
    ArrowRight,
    Activity
} from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Services = () => {
    const populations = [
        { group: 'Children', age: '6-12', desc: 'Play-based and developmental focused interventions.' },
        { group: 'Adolescents', age: '13-17', desc: 'Navigating identity, peer relationships, and academic pressure.' },
        { group: 'Adults', age: '18+', desc: 'Navigating life transitions, career, and relationships.' }
    ];

    const comingSoon = [
        'Psychological Testing',
        'BIPP (Battering Intervention and Prevention Program)',
        'Specialty Support Groups',
        'Youth Mental Health Camp'
    ];

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await serviceService.getAll();
                setServices(data);
            } catch (error) {
                console.error("Failed to load services", error);
            } finally {
                setLoading(false);
            }
        };
        loadServices();
    }, []);

    // Helper to get icon based on title/category if not stored
    const getIcon = (title: string, category: string) => {
        if (title.includes('Individual') || category === 'Clinical') return <Heart className="w-10 h-10" />;
        if (title.includes('Group')) return <Users className="w-10 h-10" />;
        if (title.includes('Family')) return <Users className="w-10 h-10" />;
        return <Activity className="w-10 h-10" />;
    };

    const getServiceColor = (index: number) => {
        const colors = ['bg-blue-500', 'bg-primary', 'bg-secondary', 'bg-slate-900'];
        return colors[index % colors.length];
    };

    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Clinical Services | Great Expectations"
                description="Comprehensive care pathways including individual, group, and family therapy. Specialized support for children, adolescents, and adults."
                keywords="services, therapy, counseling, individual therapy, group therapy, family therapy"
            />
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="space-y-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Clinical Services</h2>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                            Comprehensive <br />
                            <span className="font-serif italic font-light text-primary">Care.</span>
                        </h1>
                    </div>
                    <p className="text-xl text-slate-500 font-light leading-relaxed border-l-2 border-slate-100 pl-10">
                        We offer a diverse range of therapeutic services designed to meet the unique needs of individuals and families at every stage of life.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mb-32">
                    {loading ? (
                        <div>Loading services...</div>
                    ) : services.map((service, idx) => (
                        <motion.div
                            key={service.id || idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                        >
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 text-white shadow-xl ${getServiceColor(idx)} transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                                {getIcon(service.title, service.category)}
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

                            <Link to="/contact" className="w-full py-5 rounded-2xl bg-slate-50 group-hover:bg-primary group-hover:text-white text-slate-900 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                Book Session <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Populations Served */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Who We Serve</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Populations <span className="font-serif italic font-light text-primary">Served</span></h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {populations.map((pop, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-slate-50 rounded-[2.5rem] p-10 text-center hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-6xl font-black text-slate-200 mb-4">{pop.age}</div>
                                <h4 className="text-2xl font-black text-slate-900 mb-3">{pop.group}</h4>
                                <p className="text-slate-500 font-light">{pop.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Coming Soon */}
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-2/3 h-full -z-0 opacity-10 blur-[100px] pointer-events-none bg-primary" />
                    <div className="relative z-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">Future Expansions</h2>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-12">Coming <span className="font-serif italic font-light text-slate-400">Soon.</span></h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {comingSoon.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    <span className="font-bold tracking-wide text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default Services;
