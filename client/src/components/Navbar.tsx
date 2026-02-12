import text_logo from './../../public/sylva_text.jpg';
import tree from './../../public/tree.jpg';
import User from './User';
import { Link } from 'react-router-dom';
import { motion, useScroll } from "framer-motion";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {

    const { scrollYProgress } = useScroll();
    const { currentUser } = useAuth();
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [nav, setNav] = useState(true);

    const handleScroll = () => {

        setScrollPosition((prev) => {
            if (window.scrollY < prev) {
                setNav(true);
            }
            else if (window.scrollY > prev && window.scrollY > 150) {
                setNav(false);
            }
            return window.scrollY;
        });

    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`sticky top-0 z-10 ${nav ? '' : '-translate-y-96'} ${scrollPosition > 150 ? 'drop-shadow-lg' : ''}  rounded-lg  transition-all duration-500 ease-in-out mt-0 m-6 h-28 flex flex-row justify-between items-center `}>
                <div className={`w-36 h-28 ${scrollPosition > 100 ? '-translate-y-96' : ''} items-center gap-x-0 flex flex-row`}>
                    <img src={tree} alt="Website Logo" className="w-full h-full object-cover" />
                    <img src={text_logo} alt="Website Logo" className=" h-12" />
                </div>
                <div className='flex-1 h-full flex flex-row items-center justify-end px-4 md:px-10'>

                    <div className='hidden lg:flex h-4/5 items-center justify-center gap-x-8 rounded-lg mr-8'>
                        <Link to='/' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                            <span className="z-10">Home</span>
                        </Link>

                        <Link to='research' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                            <span className="z-10">Research</span>
                        </Link>

                        <Link to='about' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                            <span className="z-10">About us</span>
                        </Link>

                        {currentUser && <Link to='dashboard' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                            <span className="z-10">Portfolio</span>
                        </Link>}
                    </div>

                    <div className='h-8 w-0.5 bg-slate-600 mr-2' />

                    <div className='items-center cursor-pointer justify-center m-2 rounded-full'>
                        {currentUser ? <User /> : (
                            <Link to='login' className="relative h-10 hover:shadow-slate-100/30 flex w-24 cursor-pointer items-center justify-center  text-black  font-semibold rounded-lg overflow-hidden hover-effect">
                                <span className="z-10">Login</span>
                            </Link>
                        )
                        }

                    </div>
                </div>
            </div>
            <motion.div
                className="fixed bottom-1.5 z-20 left-0 right-0 h-[5px] bg-accent bg-white"
                style={{ scaleX: scrollYProgress }}
            />
        </>
    )
}

export default Navbar