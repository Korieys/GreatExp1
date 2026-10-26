import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/GElogo.png';
import Newsletter from '../Newsletter';
import { contentService, defaultSiteContent } from '../../services/contentService';
import type { SiteContent } from '../../services/contentService';

const Footer = () => {
    const [content, setContent] = useState<SiteContent>(defaultSiteContent);

    useEffect(() => {
        contentService.getMainContent().then(setContent).catch(console.error);
    }, []);
    return (
        <footer className="bg-slate-950 text-white pt-32 pb-16">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-12 gap-20 pb-24 border-b border-white/10">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 flex items-center justify-center">
                                <img src={logo} alt="GE3 Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black italic tracking-tighter leading-none">
                                    GREAT <span className="font-serif italic font-light text-primary">Expectations</span>
                                </span>
                                <span className="text-[10px] tracking-[0.3em] uppercase font-black text-slate-500 mt-1">Therapeutic Excellence</span>
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-light">
                            A premier clinical practice providing multi-disciplinary therapeutic services with a focus on holistic, data-driven outcomes.
                        </p>
                        <Newsletter />
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Practice</h4>
                            <ul className="space-y-5 text-slate-400 text-sm font-medium">
                                <li><Link to="/method" className="hover:text-primary transition-colors">Methodology</Link></li>
                                <li><Link to="/services" className="hover:text-primary transition-colors">Specializations</Link></li>
                                <li><Link to="/practitioners" className="hover:text-primary transition-colors">Clinical Staff</Link></li>
                                <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
                                <li><Link to="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intake</h4>
                            <ul className="space-y-5 text-slate-400 text-sm font-medium">
                                <li><a href={`tel:${content.contactPhone.replace(/[^+\d]/g, '')}`} className="hover:text-primary transition-colors">{content.contactPhone}</a></li>
                                <li><a href={`mailto:${content.contactEmail}`} className="break-all hover:text-primary transition-colors">{content.contactEmail}</a></li>
                                <li><Link to="/forms" className="hover:text-primary transition-colors">Patient Forms</Link></li>
                                <li><Link to="/portal" className="hover:text-primary transition-colors">Patient Portal</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Practice HQ</h4>
                            <p className="text-slate-400 leading-loose text-sm font-medium whitespace-pre-line">
                                {content.contactAddress}
                            </p>

                        </div>
                    </div>
                </div>

                <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase">© 2024 Great Expectations Therapeutic Services LLC</p>
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/feedback" className="hover:text-white transition-colors">Suggestions</Link>
                        <Link to="/grievance" className="hover:text-white transition-colors">Grievance</Link>
                        <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
