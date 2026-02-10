import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO/SEO';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Optionally add user to Firestore 'users' collection here if needed for roles
            navigate('/portal');
        } catch (err: any) {
            setError(err.message || 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Create Account | Great Expectations"
                description="Create a new account at Great Expectations."
                keywords="signup, register, account, portal"
            />
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                            sign in to existing account
                        </Link>
                    </p>
                </div>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={onSignup}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sign up' : 'Sign up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;
