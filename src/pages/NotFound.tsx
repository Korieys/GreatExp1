import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import SEO from '../components/SEO/SEO';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <SEO
                title="Page Not Found | Great Expectations"
                description="The page you are looking for does not exist."
            />
            <div className="text-center space-y-8 max-w-lg">
                <h1 className="text-9xl font-black text-slate-200">404</h1>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Page Not Found</h2>
                <p className="text-slate-500 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
