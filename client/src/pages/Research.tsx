import { MdOutlineHealthAndSafety } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import { SlEnergy } from "react-icons/sl";
import { IoArrowForward } from "react-icons/io5";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import healthcareImage from "./../../public/healthcare.jpeg"
import FMCGImage from "./../../public/FMCG.jpg"
import EnergyImage from "./../../public/Energy.png"
import { motion } from "framer-motion";

const Research = () => {
    const fadeIn = (direction: string = "up", delay: number = 0) => {
        return {
            hidden: {
                y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
                opacity: 0,
            },
            show: {
                y: 0,
                x: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    duration: 0.8,
                    delay: delay,
                    bounce: 0.2,
                },
            },
        };
    };

    const sectors = [
        {
            name: "Energy",
            icon: SlEnergy,
            image: EnergyImage,
            link: "/dashboard/energy",
            description: "Explore the dynamic energy landscape, from renewables to traditional sources."
        },
        {
            name: "Healthcare",
            icon: MdOutlineHealthAndSafety,
            image: healthcareImage,
            link: "/dashboard/healthcare",
            description: "Insights into global health trends, pharmaceuticals, and medical innovations."
        },
        {
            name: "FMCG",
            icon: GrCart,
            image: FMCGImage,
            link: "/dashboard/fmcg",
            description: "Analyzing consumer behavior and market trends in Fast Moving Consumer Goods."
        }
    ];

    return (
        <div className="w-full min-h-[90vh] flex flex-col ">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full flex-grow">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-4">
                        Sector Analysis
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">
                        Deep dive into key market sectors with our comprehensive research and expert insights.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sectors.map((sector, index) => (
                        <motion.div
                            key={sector.name}
                            variants={fadeIn("up", index * 0.1)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={sector.image}
                                    alt={sector.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                                    <sector.icon size={24} className="text-white drop-shadow-md" />
                                    <span className="text-xl font-medium drop-shadow-md">{sector.name}</span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                                    {sector.description}
                                </p>

                                <Link
                                    to={sector.link}
                                    className="inline-flex items-center text-slate-900 font-medium hover:text-slate-600 transition-colors group-hover:underline decoration-1 underline-offset-4"
                                >
                                    Read Analysis
                                    <IoArrowForward className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <footer className="w-full py-8 px-4 md:px-16 lg:px-24 border-t border-slate-200 mt-auto bg-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
                    <div className="flex items-center">
                        <span className="text-lg font-serif font-bold text-slate-900 mr-2">SYLVA™</span>
                        <Footer.Copyright href="#" by="All Rights Reserved" year={new Date().getFullYear()} className="text-slate-500 text-sm" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="/about" className="hover:text-slate-900 transition-colors">About</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Licensing</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Research;