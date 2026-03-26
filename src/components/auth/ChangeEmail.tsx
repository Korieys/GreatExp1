import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';
import { userService } from '../../services/userService';

const ChangeEmail = () => {
    const { currentUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!newEmail || !currentUser || !currentUser.email) {
            return setError("You must be logged in to change your email.");
        }

        setLoading(true);

        try {
            // Re-authenticate the user before changing the email
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // Update email in Auth
            await updateEmail(currentUser, newEmail);

            // Also update the email in our users collection
            if (currentUser.uid) {
                await userService.updateUser(currentUser.uid, { email: newEmail });
            }

            setSuccess(true);
            setCurrentPassword('');
            setNewEmail('');
        } catch (err: any) {
            console.error("Email update error:", err);
            if (err.code === 'auth/invalid-credential') {
                setError("Incorrect current password.");
            } else if (err.code === 'auth/invalid-email') {
                setError("The new email address is invalid.");
            } else if (err.code === 'auth/email-already-in-use') {
                setError("This email address is already in use by another account.");
            } else if (err.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError("Failed to change email. Please ensure your current password is correct.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-200">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Change Email Address</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Update your login email and contact info.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                    <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold flex items-center gap-2 border border-emerald-100">
                        <Check className="w-4 h-4" />
                        Email address updated successfully!
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current Password</label>
                        <input
                            type="password"
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Email Address</label>
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-900"
                            placeholder="new@example.com"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Update Email
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangeEmail;
