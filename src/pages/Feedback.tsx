import { motion } from 'framer-motion';
import { Send, MessageSquarePlus } from 'lucide-react';

const Feedback = () => {
    return (
        <div className="pt-32 pb-40">
            <section className="max-w-3xl mx-auto px-8">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6"
                    >
                        <MessageSquarePlus className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">
                        We Value Your <span className="font-serif italic font-light text-primary">Input.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                        Your suggestions help us grow and better serve our community. Please let us know how we can improve.
                    </p>
                </div>

                <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Name (Optional)</label>
                                <input type="text" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" placeholder="Your Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Email (Optional)</label>
                                <input type="email" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400" placeholder="name@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Your Suggestion</label>
                            <textarea className="w-full h-40 px-6 py-6 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 resize-none" placeholder="What's on your mind?"></textarea>
                        </div>

                        <button className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                            Send Feedback <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Feedback;
