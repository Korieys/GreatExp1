import { useEffect, useState } from 'react';
import type { BlogPost } from '../types/blog';
import { blogService } from '../services/blogService';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import BlogForm from '../components/admin/BlogForm';

const AdminBlog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await blogService.getAll();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await blogService.delete(id);
            loadPosts();
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingPost(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async () => {
        setIsFormOpen(false);
        setEditingPost(null);
        await loadPosts();
    };

    if (isFormOpen) {
        return (
            <BlogForm
                initialData={editingPost || undefined}
                onSave={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
            />
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Manager</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </button>
            </div>

            {loading ? (
                <div className="bg-white p-12 rounded-3xl text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading posts...</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {post.coverImage && (
                                                <img className="h-12 w-16 rounded-lg object-cover mr-4 shadow-sm" src={post.coverImage} alt="" />
                                            )}
                                            <div className="text-sm font-bold text-slate-900">{post.title}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-widest font-black rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">
                                        {post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(post)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(post.id!)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
