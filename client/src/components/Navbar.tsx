import text_logo from './../assets/sylva_text.jpg';
import tree from './../assets/tree.jpg';
import User from './User';
import { Link } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Menu, X } from "lucide-react";

const Navbar = () => {

    const { scrollYProgress } = useScroll();
    const { currentUser } = useAuth();
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [nav, setNav] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleScroll = () => {
        setScrollPosition((prev) => {
            if (window.scrollY < prev) {
                setNav(true);
            }
            else if (window.scrollY > prev && window.scrollY > 150) {
                setNav(false);
                setMobileMenuOpen(false); // Close mobile menu on scroll down
            }
            return window.scrollY;
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Research", path: "/research" },
        { name: "About us", path: "/about" },
    ];


    if (currentUser) {
        navLinks.push({ name: "Portfolio", path: "/dashboard" });
    }

    return (
        <>
            <div className={`sticky top-0 z-50 ${nav ? '' : '-translate-y-96'} ${scrollPosition > 50 ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'} transition-all duration-300 ease-in-out h-20 md:h-24 w-full px-4 md:px-8 flex items-center justify-between`}>

                {/* Logo Section */}
                <div className="flex items-center gap-2 h-full py-2">
                    <img src={tree} alt="Logo Icon" className="h-full object-contain max-h-16 w-auto mix-blend-multiply" />
                    <img src={text_logo} alt="Sylva" className="h-8 md:h-10 w-auto object-contain mix-blend-multiply" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className='h-6 w-px bg-slate-300 mx-2' />

                    <div className='flex items-center'>
                        {currentUser ? <User /> : (
                            <Link to='login' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-4">

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden fixed top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-40 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-2 bg-slate-50">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-slate-900 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}


                            <Link
                                to='/risk-profile'
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-900 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Risk Profile
                            </Link>

                            {!currentUser && (
                                <Link
                                    to='/login'
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-slate-900 text-white font-medium py-3 px-4 rounded-lg text-center mt-2"
                                >
                                    Login
                                </Link>
                            )}
                            <Link
                                to='/settings'
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-900 font-medium py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Settings
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="fixed bottom-0 left-0 right-0 h-1 bg-slate-900 z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />
        </>
    )
}

export default Navbar