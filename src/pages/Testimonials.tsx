import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Testimonials = () => {
    const reviews = [
        {
            text: "Great Expectations has truly transformed our family dynamic. The therapists here are not just skilled, they are incredibly compassionate and patient. We've seen amazing progress in our son's ability to regulate his emotions.",
            author: "Sarah J.",
            role: "Parent",
            stars: 5
        },
        {
            text: "I was hesitant about therapy at first, but the team here made me feel so comfortable. It's a judgment-free zone where I can really be myself. The anger management tools I've learned have changed my life.",
            author: "Michael T.",
            role: "Adult Client",
            stars: 5
        },
        {
            text: "The play therapy has been a godsend for our daughter. She actually looks forward to coming here! It's amazing to see her confidence grow with every session.",
            author: "Emily R.",
            role: "Parent",
            stars: 5
        },
        {
            text: "Professional, clean, and welcoming environment. From the front desk to the clinicians, everyone is top-notch. Highly recommend for any family seeking support.",
            author: "David L.",
            role: "Family Therapy Client",
            stars: 5
        }
    ];

    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Client Stories | Great Expectations"
                description="Read real experiences from families and individuals we are honored to serve."
                keywords="testimonials, reviews, client stories, success stories, feedback"
            />
            <section className="max-w-[1400px] mx-auto px-8">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
                        Client <span className="font-serif italic font-light text-primary">Stories.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Real experiences from the families and individuals we are honored to serve.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-50 relative group hover:scale-[1.02] transition-transform duration-500"
                        >
                            <Quote className="absolute top-10 right-10 w-12 h-12 text-slate-100 group-hover:text-primary/10 transition-colors" />

                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(review.stars)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>

                            <p className="text-lg text-slate-600 leading-relaxed font-light mb-8 relative z-10">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.author}</h4>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Testimonials;
