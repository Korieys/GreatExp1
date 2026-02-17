import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import { motion } from 'framer-motion';
import SEO from '../components/SEO/SEO';

const Archive = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await blogService.getPublished();
                setPosts(data);
            } catch (error) {
                console.error("Failed to load blog posts", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <div className="pt-32 pb-40">
            <SEO
                title="Blog | Great Expectations"
                description="Insights, tips, and news about mental health and wellness from the Great Expectations team."
                keywords="blog, mental health, wellness, articles"
            />
            <div className="max-w-[1400px] mx-auto px-8">
                <div className="mb-20">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Our Blog</h2>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                        Thoughts & <br />
                        <span className="font-serif italic font-light text-primary">Insights.</span>
                    </h1>
                </div>

                {loading ? (
                    <div>Loading articles...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <Link to={`/blog/${post.slug}`} className="block">
                                    <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden mb-6">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-primary">
                                            <span>{post.category}</span>
                                            <span>•</span>
                                            <span>{post.publishedAt?.seconds ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 text-lg">No articles published yet. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archive;
