import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white pt-32 pb-16">
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-12 gap-20 pb-24 border-b border-white/10">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <img src={logo} alt="GE3 Logo" className="w-full h-full object-cover" />
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
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16">
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Practice</h4>
                            <ul className="space-y-5 text-slate-400 text-sm font-medium">
                                <li><Link to="/method" className="hover:text-primary transition-colors">Methodology</Link></li>
                                <li><Link to="/services" className="hover:text-primary transition-colors">Specializations</Link></li>
                                <li><Link to="/practitioners" className="hover:text-primary transition-colors">Clinical Staff</Link></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Insurance Info</a></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Intake</h4>
                            <ul className="space-y-5 text-slate-400 text-sm font-medium">
                                <li>(555) 010-8888</li>
                                <li>office@ge-therapeutic.com</li>
                                <li>Referral Desk</li>
                                <li><Link to="/portal" className="hover:text-primary transition-colors">Patient Portal</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Practice HQ</h4>
                            <p className="text-slate-400 leading-loose text-sm font-medium">
                                The Sterling Building <br />
                                Suite 1400 <br />
                                Austin, Texas 78701
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase">© 2024 Great Expectations Therapeutic Services LLC</p>
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                        <a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Ethics</a>
                        <a href="#" className="hover:text-white transition-colors">Practitioner Standards</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
