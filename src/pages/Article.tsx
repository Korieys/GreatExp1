import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const Article = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            if (slug) {
                try {
                    const data = await blogService.getBySlug(slug);
                    setPost(data);
                } catch (error) {
                    console.error("Failed to load post", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadPost();
    }, [slug]);

    if (loading) return <div className="pt-32 text-center">Loading article...</div>;

    if (!post) return (
        <div className="pt-32 pb-20 text-center px-4">
            <h1 className="text-4xl font-black text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-500 mb-8">The article you are looking for does not exist or has been removed.</p>
            <Link to="/blog" className="text-primary font-bold hover:underline">Back to Blog</Link>
        </div>
    );

    return (
        <div className="pt-32 pb-40">
            <SEO
                title={`${post.title} | Great Expectations`}
                description={post.excerpt}
                keywords={post.tags?.join(', ') || 'blog, article'}
            />

            <article className="max-w-4xl mx-auto px-6 h-full">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{post.category}</span>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.publishedAt?.seconds ? new Date(post.publishedAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                        </div>
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {post.author}
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                        {post.title}
                    </h1>
                    <p className="text-xl text-slate-500 font-light leading-relaxed">
                        {post.excerpt}
                    </p>
                </div>

                {post.coverImage && (
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-16 shadow-2xl">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: post.content }} // Note: In production, sanitize this HTML!
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-slate-100">
                        <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-slate-50 rounded-full text-slate-600 font-medium text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default Article;
