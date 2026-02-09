import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Phone } from 'lucide-react';

const Resources = () => {
    const resources = [
        {
            category: 'Crisis Support',
            items: [
                { name: 'National Suicide Prevention Lifeline', desc: '24/7, free and confidential support.', contact: '988' },
                { name: 'Crisis Text Line', desc: 'Text HOME to 741741 to connect with a Crisis Counselor.', contact: 'Text 741741' },
                { name: 'Domestic Violence Hotline', desc: '24/7 access to resources and support.', contact: '1-800-799-SAFE' }
            ]
        },
        {
            category: 'Mental Health Education',
            items: [
                { name: 'NAMI (National Alliance on Mental Illness)', desc: 'The nation’s largest grassroots mental health organization.', link: '#' },
                { name: 'MentalHealth.gov', desc: 'One-stop access to U.S. government mental health information.', link: '#' },
                { name: 'Psychology Today', desc: 'Find detailed listings for mental health professionals.', link: '#' }
            ]
        },
        {
            category: 'Child & Family',
            items: [
                { name: 'Child Mind Institute', desc: 'Transforming the lives of children and families struggling with mental health and learning disorders.', link: '#' },
                { name: 'Zero to Three', desc: 'Ensuring all babies and toddlers have a strong start in life.', link: '#' }

            ]
        }
    ];

    return (
        <div className="pt-32 pb-40 text-slate-900">
            <section className="max-w-[1200px] mx-auto px-8">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest mb-8"
                    >
                        <BookOpen className="w-4 h-4" />
                        Curated Library
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
                        Community <span className="font-serif italic font-light text-primary">Resources.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        A collection of trusted organizations, hotlines, and educational materials to support you on your journey.
                    </p>
                </div>

                <div className="grid gap-12">
                    {resources.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all duration-300"
                        >
                            <h2 className="text-2xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">{section.category}</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.items.map((item, i) => (
                                    <div key={i} className="group">
                                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                            {item.name}
                                            {item.link && <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-light mb-4 leading-relaxed">{item.desc}</p>
                                        {item.contact && (
                                            <div className="flex items-center gap-2 text-primary font-bold text-sm bg-blue-50 w-fit px-3 py-1 rounded-lg">
                                                <Phone className="w-3 h-3" /> {item.contact}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Resources;
