
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

const Portal = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, #61B0E233 0%, transparent 60%), radial-gradient(circle at bottom left, #FFC92B11 0%, transparent 60%)` }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full mx-8"
            >
                <div className="glass rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 space-y-12">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary mx-auto shadow-xl flex items-center justify-center overflow-hidden rotate-3">
                            <img src={logo} alt="GE3 Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Portal</h1>
                        <p className="text-sm text-slate-500 font-medium">Access your therapeutic records and scheduling.</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Access Email</label>
                            <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium" placeholder="parent@example.com" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center ml-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                                <a href="#" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <input type="password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium" placeholder="••••••••" />
                                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            </div>
                        </div>

                        <button className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 group">
                            Decrypt & Enter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-3 justify-center mb-6">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Secure AES-256 Authentication</span>
                        </div>
                        <p className="text-[10px] text-center text-slate-400 font-medium px-4">
                            Locked for your protection. If you are a new family, please complete an <a href="/contact" className="text-primary font-bold">intake form</a> first.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Portal;
