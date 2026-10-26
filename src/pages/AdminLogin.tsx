import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Shield } from 'lucide-react';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            // Verify staff / administrator role in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
                await signOut(auth);
                throw new Error("Access Denied: This account does not have staff or administrator privileges.");
            }

            navigate('/admin');
        } catch (err: any) {
            const message = err.code ? getFirebaseErrorMessage(err) : (err.message || 'Failed to sign in');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-all duration-500 shadow-lg border border-primary/20">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">
                        Staff Admin Portal
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Restricted access for verified staff and administrators only.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onLogin}>
                    {error && (
                        <div role="alert" className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium text-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="admin-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Staff Email Address
                            </label>
                            <input
                                id="admin-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent sm:text-sm font-medium transition-all"
                                placeholder="staff@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-4 py-3.5 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent sm:text-sm font-medium transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-slate-900 bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying staff credentials...
                                </span>
                            ) : 'Sign in to Dashboard'}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
