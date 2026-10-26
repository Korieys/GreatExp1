import { useState } from 'react';
import { AlertTriangle, FileWarning, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';
import { contactService } from '../services/contactService';

const Grievance = () => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfIncident, setDateOfIncident] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await contactService.createInquiry({
                parentName: fullName.trim(),
                email: 'N/A',
                phoneNumber: phoneNumber.trim(),
                dateOfIncident: dateOfIncident || 'N/A',
                serviceOfInterest: 'Grievance',
                message: `Date of Incident: ${dateOfIncident || 'N/A'}\nPhone: ${phoneNumber.trim()}\n\nDescription:\n${description.trim()}`,
                type: 'grievance',
            });
            setSubmitted(true);
            setFullName('');
            setPhoneNumber('');
            setDateOfIncident('');
            setDescription('');
        } catch (err) {
            console.error("Error submitting grievance:", err);
            setError('Failed to submit grievance. Your entries were preserved. Please try again or contact the clinic directly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-48 pb-40">
            <SEO
                title="Grievance Procedure | Great Expectations"
                description="Submit a formal grievance or complaint. We take all concerns seriously and will address them promptly."
                keywords="grievance, complaint, feedback, concern, report"
                url="https://www.gexpectations.com/grievance"
            />
            <section className="max-w-3xl mx-auto px-8">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-6">
                        Grievance <span className="font-serif italic font-light text-slate-400">Procedure.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                        We take all client concerns seriously. If you have a formal complaint or issue regarding services, please submit it below so our clinical leadership can review it.
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-red-50 shadow-xl shadow-red-500/5 text-center">
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-8 max-w-md mx-auto">
                            <h3 className="text-xl font-bold mb-2">Grievance Submitted</h3>
                            <p className="text-slate-600 font-light leading-relaxed">Your complaint has been recorded for practice administration. A clinical director will review the information and follow up directly.</p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors cursor-pointer"
                            >
                                Submit another grievance
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-red-50 shadow-xl shadow-red-500/5">
                        <form className="space-y-8" onSubmit={handleSubmit} aria-describedby="grievance-notice">
                            <div id="grievance-notice" className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    This form is monitored by clinic leadership. Please share contact information and a summary of your concern. Do not submit clinical records or emergency health notices. For immediate assistance, please call the clinic directly at <a href="tel:8323996141" className="font-bold underline">832.399.6141</a>.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label htmlFor="grievance-name" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Full Name</label>
                                    <input
                                        id="grievance-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        maxLength={120}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium"
                                        required
                                        disabled={loading}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="grievance-phone" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Phone Number</label>
                                    <input
                                        id="grievance-phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        maxLength={30}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium"
                                        required
                                        disabled={loading}
                                        placeholder="832-555-0100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="grievance-date" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Date of Incident</label>
                                <input
                                    id="grievance-date"
                                    name="dateOfIncident"
                                    type="date"
                                    value={dateOfIncident}
                                    onChange={(e) => setDateOfIncident(e.target.value)}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium bg-white"
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="grievance-description" className="text-xs font-black uppercase tracking-wider text-slate-500 pl-4">Description of Grievance</label>
                                <textarea
                                    id="grievance-description"
                                    name="description"
                                    value={description}
                                    maxLength={3000}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-40 px-6 py-4 rounded-3xl bg-slate-50 border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none font-medium"
                                    placeholder="Please provide specific details regarding your concern..."
                                    required
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
                                className="w-full py-5 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-[0.25em] shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Submitting...' : 'Submit Formal Complaint'} <FileWarning className="w-4 h-4" />
                            </button>

                            <p className="text-[10px] text-center text-slate-400 font-medium">
                                Grievances are reviewed under the practice's administrative oversight. <Link to="/privacy" className="underline underline-offset-4">Privacy notice</Link>.
                            </p>
                        </form>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Grievance;
