
import { motion } from 'framer-motion';
import {
    Heart,
    Users,
    ArrowRight,
    MessageCircle,
    Accessibility,
    ArrowUpRight,
    ShieldCheck,
    Activity,
    Layers
} from 'lucide-react';
import heroImage from '../assets/hero.jpg';

// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
};

const Home = () => {
    const services = [
        {
            title: 'Pediatric Development',
            category: 'Child & Adolescent',
            description: 'Sophisticated play-based interventions designed to foster neuro-resilience and emotional agility.',
            icon: <Heart className="w-6 h-6" />,
        },
        {
            title: 'Speech & Communication',
            category: 'Clinical Linguistics',
            description: 'Advanced therapeutic pathways for articulation, language processing, and social communication.',
            icon: <MessageCircle className="w-6 h-6" />,
        },
        {
            title: 'Occupational Therapy',
            category: 'Sensory Integration',
            description: 'Specialized motor control and sensory processing support to maximize functional independence.',
            icon: <Accessibility className="w-6 h-6" />,
        },
        {
            title: 'Family Dynamics',
            category: 'Systemic Coaching',
            description: 'Evidence-based strategies for parents and caregivers to create a thriving home environment.',
            icon: <Users className="w-6 h-6" />,
        },
    ];

    return (
        <div className="bg-white selection:bg-secondary/20">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center pt-24 lg:pt-0 overflow-hidden bg-white">
                {/* Abstract Backgrounds */}
                <div className="absolute top-0 right-0 w-2/3 h-full -z-10 opacity-40 blur-[140px] pointer-events-none"
                    style={{ background: `radial-gradient(circle at top right, #61B0E222 0%, transparent 60%)` }} />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 -z-10 opacity-30 blur-[120px] pointer-events-none"
                    style={{ background: `radial-gradient(circle at bottom left, #FFC92B11 0%, transparent 60%)` }} />

                <div className="max-w-[1400px] mx-auto px-8 w-full">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-6 relative z-10 order-2 lg:order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] text-slate-900">
                                    Exceeding <br />
                                    <span className="italic font-serif font-light text-primary">the expected.</span>
                                </h1>

                                <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-light">
                                    A concierge clinical practice where specialized therapy meets uncompromising care. We partner with families to transform development from a challenge into a journey of discovery.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                    <motion.button
                                        whileHover={{ x: 8 }}
                                        className="px-10 py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg flex items-center gap-4 group shadow-2xl transition-all"
                                    >
                                        Private Consultation
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <div className="flex items-center gap-4 px-6 py-4">
                                        <div className="p-3 rounded-xl bg-blue-50 text-primary">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">HIPAA Compliant</p>
                                            <p className="font-bold text-slate-700 text-sm italic">Patient Privacy Assured</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Visual Composition */}
                        <div className="lg:col-span-6 relative order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="relative"
                            >
                                {/* Main Hero Image Frame */}
                                <div className="relative z-10 w-full aspect-[11/14] lg:aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] md:border-[16px] border-white group">
                                    <img
                                        src={heroImage}
                                        alt="Therapy Session"
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                                </div>

                                {/* Progress Visualizer Overlay */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-40 -left-6 glass p-5 rounded-2xl w-60 hidden md:block z-20"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                            <Activity className="text-white w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Efficacy</p>
                                            <p className="font-bold text-slate-900 text-sm leading-tight">Response Rate</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black text-slate-400 tracking-wider">COGNITIVE</span>
                                            <span className="text-[10px] font-bold text-primary">92%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "92%" }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                                className="h-full bg-primary rounded-full"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Clinician Availability Badge */}
                                <motion.div
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-20 -right-8 glass-dark p-7 rounded-[2.5rem] w-64 text-white hidden md:block z-20"
                                >
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <span className="h-2 w-2 rounded-full bg-green-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 underline decoration-primary underline-offset-4">Practitioner Status</span>
                                    </div>
                                    <p className="text-base font-bold leading-snug mb-6">Now Accepting New Patient Intakes</p>
                                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border border-white/10">View Slots</button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clinical Affiliations */}
            <div className="bg-slate-50 py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">Trusted & Accredited Clinical Partners</p>
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale contrast-125">
                        <span className="text-2xl font-black italic tracking-tighter font-serif">AOTA Certified</span>
                        <span className="text-2xl font-black italic tracking-tighter font-serif">ASHA Standards</span>
                        <span className="text-2xl font-black italic tracking-tighter font-serif">Board Approved</span>
                        <span className="text-2xl font-black italic tracking-tighter font-serif">Excellence Hub</span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <section id="clinical-care" className="py-32 bg-white">
                <div className="max-w-[1400px] mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-end mb-24">
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Clinical Scope</h2>
                            <p className="text-5xl md:text-6xl font-black leading-none text-slate-900 tracking-tighter">
                                Transformative <br />
                                <span className="font-serif italic font-light text-primary">Care Pathways.</span>
                            </p>
                        </div>
                        <p className="text-slate-500 text-lg leading-relaxed font-light border-l-2 border-slate-100 pl-10">
                            We provide a sophisticated ecosystem of support, integrating neuro-clinical rigor with a warm, human-centric approach to therapy.
                        </p>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {services.map((service, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                whileHover={{ y: -12 }}
                                className="group p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.1)] transition-all duration-500"
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-sm transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 bg-white text-primary shadow-lg shadow-black/5"
                                >
                                    {service.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">{service.category}</span>
                                <h3 className="text-2xl font-bold mb-5 tracking-tight">{service.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                                    {service.description}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-primary transition-colors">
                                    Pathway Details <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section id="our-method" className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:60px_60px]" />
                </div>

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="inline-block px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                The Methodology
                            </div>
                            <h2 className="text-6xl md:text-7xl font-light leading-[0.95] tracking-tight">
                                Our core <br />
                                <span className="italic font-serif text-secondary">Philosophy.</span>
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { title: "Personalized Trajectories", text: "Standardized care is never our standard. Every plan is an original composition." },
                                    { title: "Outcome-Driven Metrics", text: "We measure progress through both clinical benchmarks and quality-of-life improvements." },
                                    { title: "Unwavering Support", text: "Our commitment to your family extends far beyond the duration of a session." }
                                ].map((point, i) => (
                                    <div key={i} className="flex gap-8 items-start group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500 group-hover:scale-110">
                                            <Layers className="w-6 h-6 text-primary group-hover:text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2 tracking-tight">{point.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed font-light">{point.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] md:rounded-[5rem] border border-white/10 p-8 md:p-12 flex items-center justify-center relative overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
                                    alt="Therapeutic Connection"
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-slate-950/50" />

                                <div className="text-center space-y-10 relative z-10">
                                    <p className="text-3xl font-light italic text-slate-100 leading-tight">
                                        "At Great Expectations, we don't just treat conditions; we nurture the human spirit to occupy its fullest expression."
                                    </p>
                                    <div className="pt-4 border-t border-white/20 w-2/3 mx-auto">
                                        <p className="font-black text-white tracking-[0.3em] uppercase text-[10px] mb-1">Clinical Leadership</p>
                                        <p className="text-primary text-[9px] font-black uppercase tracking-widest">Board of Excellence</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-40 bg-white">
                <div className="max-w-5xl mx-auto px-8 text-center space-y-12">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95]">
                        Elevate your <br />
                        <span className="font-serif italic font-light text-primary">Great Expectations.</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                        Join a practice where your progress is our only priority. Private intakes are currently available by appointment.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10 px-4">
                        <motion.button
                            whileHover={{ y: -5, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)' }}
                            className="px-10 md:px-14 py-6 md:py-7 rounded-[1.5rem] md:rounded-[2rem] bg-slate-950 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all"
                        >
                            Initiate Consultation
                        </motion.button>
                        <button className="px-10 md:px-14 py-6 md:py-7 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-900 hover:bg-slate-50 transition-all">
                            The Clinicians
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
