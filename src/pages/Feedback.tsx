import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { contactService } from '../services/contactService';

const Feedback = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await contactService.createInquiry({
                parentName: name.trim() || 'Anonymous',
                email: email.trim() || 'N/A',
                serviceOfInterest: 'Feedback',
                message: suggestion.trim(),
                type: 'feedback',
            });
            setSubmitted(true);
            setName('');
            setEmail('');
            setSuggestion('');
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setError('Your feedback could not be submitted right now. Your entries are preserved. Please try again or call the practice.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-48 pb-40">
            <SEO
                title="Feedback | Great Expectations"
                description="Your suggestions help us grow and better serve our community. Please let us know how we can improve."
                keywords="feedback, suggestions, input, improvement, contact"
                url="https://www.gexpectations.com/feedback"
            />
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

                {submitted ? (
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-8 max-w-md mx-auto">
                            <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                            <p className="text-slate-600 font-light leading-relaxed">Your feedback has been successfully submitted. We appreciate your suggestions and input to help us improve.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer"
                            >
                                Submit another feedback
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <form className="space-y-8" onSubmit={handleSubmit} aria-describedby="feedback-notice">
                            <div id="feedback-notice" className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Please share general feedback only. Do not submit sensitive health records, diagnoses, or urgent clinical matters through this form. For clinical records, use the <Link to="/forms" className="font-bold underline underline-offset-4">patient portal</Link>.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label htmlFor="feedback-name" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Name (Optional)</label>
                                    <input
                                        id="feedback-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        maxLength={120}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                        placeholder="Your Name"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="feedback-email" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Email (Optional)</label>
                                    <input
                                        id="feedback-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        maxLength={254}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                                        placeholder="name@example.com"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="feedback-suggestion" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Your Suggestion</label>
                                <textarea
                                    id="feedback-suggestion"
                                    name="suggestion"
                                    required
                                    maxLength={2000}
                                    value={suggestion}
                                    onChange={(e) => setSuggestion(e.target.value)}
                                    className="w-full h-40 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 resize-none font-medium"
                                    placeholder="What's on your mind?"
                                    disabled={loading}
                                ></textarea>
                            </div>

                            {error && (
                                <div role="alert" className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Sending...' : 'Send Feedback'} <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Feedback;
