import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { contactService } from '../services/contactService';
import { contentService, defaultSiteContent } from '../services/contentService';
import type { SiteContent } from '../services/contentService';

const Contact = () => {
    const [formData, setFormData] = useState({
        parentName: '',
        email: '',
        serviceOfInterest: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState<SiteContent>(defaultSiteContent);

    useEffect(() => {
        contentService.getMainContent().then(setContent).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setError('');

        try {
            await contactService.createInquiry(formData);
            setSubmitted(true);
            setFormData({ parentName: '', email: '', serviceOfInterest: '', message: '' });
        } catch (err) {
            console.error(err);
            setError('Your request could not be confirmed. Your entries are still here. Please try again or call the practice.');
        } finally {
            setLoading(false);
        }
    };
    const clinicSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": "Great Expectations",
        "image": "https://www.gexpectations.com/favicon.png",
        "url": "https://www.gexpectations.com/contact",
        "telephone": content.contactPhone,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Houston",
            "addressRegion": "TX",
            "addressCountry": "US"
        }
    });

    return (
        <div className="pt-48 pb-40">
            <SEO
                title="Contact Us | Great Expectations"
                description="Get in touch with Great Expectations. We are currently accepting new patient inquiries."
                keywords="contact, intake, appointment, consultation, location, phone, email"
                url="https://www.gexpectations.com/contact"
                schema={clinicSchema}
            />
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="grid lg:grid-cols-2 gap-24">
                    {/* Info Side */}
                    <div className="space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intake & Contact</h2>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                                Begin the <br />
                                <span className="font-serif italic font-light text-primary">Conversation.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-light leading-relaxed max-w-xl">
                                We are currently accepting new patient inquiries. Our intake desk will review your initial information and reach out for a private consultation.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direct Line</p>
                                    <a className="text-xl font-bold text-slate-900 underline underline-offset-4" href={`tel:${content.contactPhone.replace(/[^+\d]/g, '')}`}>{content.contactPhone}</a>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Clinical Desk</p>
                                    <a className="text-xl font-bold text-slate-900 break-all underline underline-offset-4" href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
                                </div>
                            </div>

                            <div className="flex gap-8 group">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Practice HQ</p>
                                    <p className="text-xl font-bold text-slate-900 leading-snug whitespace-pre-line">{content.contactAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[3rem] bg-slate-950 text-white relative overflow-hidden">
                            <ShieldCheck className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">General inquiries</p>
                                    <p className="text-sm font-bold">Use the patient intake portal for clinical details</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-slate-50 rounded-[2.5rem] md:rounded-[4rem] p-8 lg:p-16">
                        <h2 className="text-2xl font-black text-slate-900 mb-10">Request a callback</h2>
                        {submitted ? (
                            <div className="bg-green-100 border border-green-200 text-green-800 rounded-2xl p-8 text-center">
                                <h3 className="text-xl font-bold mb-2">Request received</h3>
                                <p>Your request has been saved for the intake desk. This does not book an appointment.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-sm font-bold underline hover:text-primary transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit} aria-describedby="contact-privacy">
                                <p id="contact-privacy" className="text-sm text-slate-600 leading-relaxed">Share only your contact details and a brief general question. Please leave out diagnoses, medical history, insurance details, and other sensitive information. For clinical paperwork, use the <Link to="/forms" className="font-semibold underline underline-offset-4">patient intake portal</Link>.</p>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your name</label>
                                        <input
                                            id="contact-name" name="name" autoComplete="name" maxLength={120}
                                            type="text"
                                            required
                                            value={formData.parentName}
                                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email address</label>
                                        <input
                                            id="contact-email" name="email" autoComplete="email" maxLength={254}
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="contact-service" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Service of interest (optional)</label>
                                    <select id="contact-service" name="service"
                                        value={formData.serviceOfInterest}
                                        onChange={(e) => setFormData({ ...formData, serviceOfInterest: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium appearance-none"
                                    >
                                        <option value="">Select a Pathway</option>
                                        <option value="Pediatric Development">Pediatric Development</option>
                                        <option value="Speech & Language">Speech & Language</option>
                                        <option value="Occupational Therapy">Occupational Therapy</option>
                                        <option value="Family Dynamics">Family Dynamics</option>
                                        <option value="Traditional Outpatient Services">Traditional Outpatient Services</option>
                                        <option value="Partial Hospitalization Program">Partial Hospitalization Program</option>
                                        <option value="Intensive Outpatient Program">Intensive Outpatient Program</option>
                                        <option value="Wraparound Services">Wraparound Services</option>
                                        <option value="Supervised Visitation Services">Supervised Visitation Services</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">General question</label>
                                    <textarea id="contact-message" name="message" maxLength={2000} aria-describedby="contact-privacy"
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors font-medium resize-none"
                                        placeholder="For example: Please contact me about availability."
                                    ></textarea>
                                </div>

                                {error && (
                                    <div role="alert" className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Submit Request'} <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>

                                <p className="text-[10px] text-center text-slate-400 font-medium">We use these details to respond to your request. <Link to="/privacy" className="underline underline-offset-4">Read the privacy policy</Link>.</p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
