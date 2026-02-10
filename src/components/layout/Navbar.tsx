import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/GElogo.png';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { userLoggedIn, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Clinical Care', path: '/services' },
        { name: 'Our Method', path: '/method' },
        { name: 'Practitioners', path: '/practitioners' },
        { name: 'Portal', path: '/portal' },
    ];

    return (
        <nav
            className={`fixed w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-white/90 backdrop-blur-2xl py-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)]' : 'bg-primary py-8'
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-24 h-24 flex items-center justify-center">
                            <img src={logo} alt="GE3 Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-xl font-black italic tracking-tighter leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                GREAT <span className={`font-serif italic font-light transition-colors ${scrolled ? 'text-primary' : 'text-secondary'}`}>Expectations</span>
                            </span>
                            <span className={`text-[9px] tracking-[0.3em] uppercase font-black mt-1 transition-colors ${scrolled ? 'text-slate-400' : 'text-white/70'}`}>Therapeutic Services</span>
                        </div>
                    </Link>
                </motion.div>

                <div className="hidden lg:flex items-center gap-10">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors relative group ${scrolled
                                ? (location.pathname === item.path ? 'text-primary' : 'text-slate-500 hover:text-primary')
                                : (location.pathname === item.path ? 'text-secondary' : 'text-white hover:text-secondary')
                                }`}
                        >
                            {item.name}
                            <span className={`absolute -bottom-1 left-0 h-0.5 transition-all group-hover:w-full ${scrolled ? 'bg-primary' : 'bg-secondary'} ${location.pathname === item.path ? 'w-full' : 'w-0'
                                }`} />
                        </Link>
                    ))}
                    <Link to="/book">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(97, 176, 226, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg transition-all bg-secondary text-[#332a00]"
                        >
                            Request Intake
                        </motion.button>
                    </Link>

                    {userLoggedIn && (
                        <>
                            {useAuth().isAdmin && (
                                <Link
                                    to="/admin"
                                    className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors relative group ${scrolled
                                        ? (location.pathname === '/admin' ? 'text-primary' : 'text-slate-500 hover:text-primary')
                                        : (location.pathname === '/admin' ? 'text-secondary' : 'text-white hover:text-secondary')
                                        }`}
                                >
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={async () => {
                                    try {
                                        await logout();
                                        navigate('/login');
                                    } catch (e) {
                                        console.error("Logout failed", e);
                                    }
                                }}
                                className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${scrolled ? 'text-slate-500 hover:text-red-500' : 'text-white hover:text-red-300'}`}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

                <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className={`w-8 h-8 transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link to="/book" onClick={() => setIsMenuOpen(false)} className="w-full">
                                <button className="w-full py-4 rounded-xl bg-secondary text-[#332a00] font-black text-[11px] uppercase tracking-widest shadow-lg">
                                    Request Intake
                                </button>
                            </Link>
                            {userLoggedIn && (
                                <>
                                    {useAuth().isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={async () => {
                                            setIsMenuOpen(false);
                                            await logout();
                                            navigate('/login');
                                        }}
                                        className="text-sm font-bold uppercase tracking-widest text-left text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
