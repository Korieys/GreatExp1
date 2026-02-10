import { Link } from 'react-router-dom';
import logo from '../../assets/GElogo.png';
import Newsletter from '../Newsletter';

const Footer = () => {
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
                                <li>(555) 010-8888</li>
                                <li>office@ge-therapeutic.com</li>
                                <li><Link to="/forms" className="hover:text-primary transition-colors">Patient Forms</Link></li>
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
                            <div className="flex gap-4">
                                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary transition-all">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary transition-all">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.584.016 4.849.075 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.849c-.055 1.17-.25 1.805-.415 2.227-.217.562-.477.96-.896 1.382-.419.419-.82.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.849-.074c-1.17-.055-1.805-.25-2.227-.415-.561-.217-.96-.476-1.383-.896-.419-.419-.678-.819-.895-1.382-.164-.422-.36-1.056-.413-2.227C2.175 15.667 2.16 15.26 2.16 12s.015-3.667.075-4.947c.055-1.171.249-1.805.415-2.227.217-.562.476-.96.895-1.382.419-.419.819-.679 1.383-.896.422-.164 1.056-.36 2.227-.413 1.265-.057 1.645-.07 4.849-.07M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40">
                    <p className="text-[10px] font-black tracking-[0.3em] uppercase">© 2024 Great Expectations Therapeutic Services LLC</p>
                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
                        <Link to="/privacy" className="hover:text-white transition-colors">HIPAA Compliance</Link>
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
