
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Users,
    ArrowRight,
    ArrowUpRight,
    ShieldCheck,
    Activity,
    Layers,
    Calendar,
    Clock,
    MapPin,
    ExternalLink,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import SEO from '../components/SEO/SEO';
import { contentService, defaultSiteContent } from '../services/contentService';
import type { SiteContent } from '../services/contentService';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types/service';

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
    const [content, setContent] = useState<SiteContent>(defaultSiteContent);
    const [dbServices, setDbServices] = useState<Service[]>([]);
    const [activeFlyer, setActiveFlyer] = useState<string | null>(null);

    useEffect(() => {
        contentService.getMainContent().then(setContent).catch(console.error);
        serviceService.getAll().then(setDbServices).catch(console.error);
    }, []);

    const fallbackServices = [
        {
            title: 'Pediatric Development',
            category: 'Child & Adolescent',
            description: 'Sophisticated play-based interventions designed to foster neuro-resilience and emotional agility.',
            icon: <Heart className="w-6 h-6" />,
        },
        {
            title: 'Partial Hospitalization',
            category: 'Comprehensive Day Treatment',
            description: 'Full-day structured clinical programming providing intensive stabilization and therapeutic support.',
            icon: <ShieldCheck className="w-6 h-6" />,
        },
        {
            title: 'Intensive Outpatient Programming',
            category: 'Structured Recovery',
            description: 'Flexible, evidence-based therapy sessions designed to support sustainable healing while maintaining daily routines.',
            icon: <Activity className="w-6 h-6" />,
        },
        {
            title: 'Family Dynamics',
            category: 'Systemic Coaching',
            description: 'Evidence-based strategies for parents and caregivers to create a thriving home environment.',
            icon: <Users className="w-6 h-6" />,
        },
    ];

    const displayServices = dbServices.length > 0
        ? dbServices.slice(0, 4).map(s => ({
            title: s.title,
            category: s.category,
            description: s.description || '',
            icon: <Activity className="w-6 h-6" />
        }))
        : fallbackServices;

    const clinicSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": "Great Expectations",
        "image": "https://greatexpectations.clinic/hero.jpg",
        "url": "https://greatexpectations.clinic/",
        "telephone": content.contactPhone,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "TX",
            "addressCountry": "US"
        }
    });

    return (
        <div className="bg-white selection:bg-secondary/20">
            <SEO
                title={content.seoTitle || "Great Expectations - Concierge Clinical Therapy"}
                description={content.seoDescription || "Specialized therapy meeting uncompromising care. We partner with families to transform development from a challenge into a journey of discovery."}
                keywords="therapy, pediatric, development, speech, occupational, family, counseling"
                schema={clinicSchema}
            />
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
                                    {content.heroTitleLine1} <br />
                                    <span className="italic font-serif font-light text-primary">{content.heroTitleLine2}</span>
                                </h1>

                                <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-light">
                                    {content.heroSubtitle}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                    <Link to="/forms">
                                        <motion.button
                                            whileHover={{ x: 8 }}
                                            className="px-10 py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg flex items-center gap-4 group shadow-2xl transition-all"
                                        >
                                            Private Consultation
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </Link>

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
                                        <span className={`h-2 w-2 rounded-full ${content.clinicAcceptingNew ? 'bg-green-400' : 'bg-red-400'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 underline decoration-primary underline-offset-4">Practitioner Status</span>
                                    </div>
                                    <p className="text-base font-bold leading-snug mb-6">{content.clinicStatusText}</p>
                                    <Link to="/book" className="w-full block">
                                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border border-white/10 cursor-pointer">View Slots</button>
                                    </Link>
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

            {/* Upcoming Events Section */}
            <section className="py-24 bg-slate-50 overflow-hidden relative">
                {/* Visual accents */}
                <div className="absolute top-0 left-1/4 w-96 h-96 -z-10 opacity-30 blur-[130px] bg-primary/20 pointer-events-none rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 -z-10 opacity-30 blur-[130px] bg-secondary/20 pointer-events-none rounded-full" />

                <div className="max-w-[1400px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Registration & Events
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                            Upcoming <span className="font-serif italic font-light text-primary">Community Events</span>
                        </h2>
                        <p className="mt-4 text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                            Discover programs, retreats, and parent discussion groups hosted by Great Expectations Therapeutic Services.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Event 1 Card: The Great Escape Summer Program */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                {/* Event Cover Image */}
                                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 shadow-inner">
                                    <img
                                        src="/GreatEscapeSummerProgramQR.jpg"
                                        alt="Great Escape Summer Program Flyer"
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-500" />
                                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-lg">
                                        Summer Program
                                    </span>
                                </div>

                                {/* Title & Info */}
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-primary transition-colors">
                                    The Great Escape Summer Program
                                </h3>
                                
                                <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                                    An enriching, therapeutic summer camp focusing on peer interaction, social skills, mental health wellness, arts & crafts, and wellness demonstrations. Designed for children to build neuro-resilience and make lasting connections.
                                </p>

                                {/* Event Metadata */}
                                <div className="space-y-3.5 border-t border-slate-100 pt-6 mb-8 text-slate-600 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">June 8th – August 7th, 2026</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">Open to ages 6 – 15</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-primary font-serif italic">$150 Per Month / Weekly Options</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100/60">
                                <a
                                    href="https://www.jotform.com/build/260664906622157"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-grow flex"
                                >
                                    <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer">
                                        Register Online <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </a>
                                <button
                                    onClick={() => setActiveFlyer("/GreatEscapeSummerProgram.png")}
                                    className="py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                >
                                    View Flyer
                                </button>
                            </div>
                        </motion.div>

                        {/* Event 2 Card: What I Wish My Parents Knew */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                {/* Event Cover Image */}
                                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 shadow-inner">
                                    <img
                                        src="/WhatIWishMyParentsKnew.jpg"
                                        alt="What I Wish My Parents Knew Flyer"
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-500" />
                                    <span className="absolute top-4 left-4 bg-secondary text-[#332a00] text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-lg">
                                        Parent Retreat
                                    </span>
                                </div>

                                {/* Title & Info */}
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-primary transition-colors">
                                    What I Wish My Parents Knew
                                </h3>
                                
                                <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                                    A youth mental well-being film screening and interactive discussion series for parents. Hosted as part of the Back to School Wellness Retreat. Presented in partnership with <span className="font-semibold text-slate-700">Tell My Story</span>.
                                </p>

                                {/* Event Metadata */}
                                <div className="space-y-3.5 border-t border-slate-100 pt-6 mb-8 text-slate-600 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">Saturday, August 8th, 2026</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">10:00 AM – 11:00 AM</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700 leading-relaxed">
                                            Great Expectations (Suite 295), Houston TX
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100/60">
                                <Link to="/contact" className="flex-grow flex">
                                    <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer">
                                        RSVP / Contact Us
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setActiveFlyer("/WhatIWishMyParentsKnew.jpg")}
                                    className="py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                >
                                    View Flyer
                                </button>
                            </div>
                        </motion.div>

                        {/* Event 3 Card: SHIFT: Do What Moves You */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                {/* Event Cover Image */}
                                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-8 bg-slate-100 shadow-inner">
                                    <img
                                        src="/ShiftStudents.jpg"
                                        alt="SHIFT: Do What Moves You Flyer"
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-500" />
                                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full shadow-lg">
                                        Student Retreat
                                    </span>
                                </div>

                                {/* Title & Info */}
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-primary transition-colors">
                                    SHIFT: Do What Moves You
                                </h3>
                                
                                <p className="text-slate-500 font-light text-sm leading-relaxed mb-6">
                                    A FREE youth mental well-being film screening and interactive discussion series for students. Hosted as part of the Back to School Wellness Retreat. Presented in partnership with <span className="font-semibold text-slate-700">Tell My Story</span>.
                                </p>

                                {/* Event Metadata */}
                                <div className="space-y-3.5 border-t border-slate-100 pt-6 mb-8 text-slate-600 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">Saturday, August 8th, 2026</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700">10:00 AM – 11:00 AM</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                                        <span className="font-semibold text-slate-700 leading-relaxed">
                                            Great Expectations (Suite 295), Houston TX
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100/60">
                                <Link to="/contact" className="flex-grow flex">
                                    <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer">
                                        RSVP / Contact Us
                                    </button>
                                </Link>
                                <button
                                    onClick={() => setActiveFlyer("/ShiftStudents.jpg")}
                                    className="py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                                >
                                    View Flyer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

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
                        {displayServices.map((service, idx) => (
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
                                    loading="lazy"
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
                        <Link to="/forms">
                            <motion.button
                                whileHover={{ y: -5, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)' }}
                                className="px-10 md:px-14 py-6 md:py-7 rounded-[1.5rem] md:rounded-[2rem] bg-slate-950 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all"
                            >
                                Initiate Consultation
                            </motion.button>
                        </Link>
                        <Link to="/practitioners">
                            <button className="px-10 md:px-14 py-6 md:py-7 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-900 hover:bg-slate-50 transition-all cursor-pointer">
                                The Clinicians
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Fullscreen Flyer Viewer Modal */}
            <AnimatePresence>
                {activeFlyer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveFlyer(null)}
                        className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveFlyer(null)}
                                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-primary transition-colors cursor-pointer shadow-lg"
                                aria-label="Close flyer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <img
                                src={activeFlyer}
                                alt="Event Flyer Detail"
                                className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
