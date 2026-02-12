import { motion } from "framer-motion";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
    const fadeIn = (direction: string = "up", delay: number = 0) => {
        return {
            hidden: {
                y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
                x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
                opacity: 0,
            },
            show: {
                y: 0,
                x: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    duration: 1.2,
                    delay: delay,
                    bounce: 0.3,
                },
            },
        };
    };

    return (
        <div className="w-full flex-col min-h-[80vh] flex items-center justify-between">
            <motion.div
                className="max-w-4xl px-6 py-20 md:py-32 flex flex-col items-center text-center"
                variants={fadeIn("up", 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-12">
                    About Me
                </h1>

                <div className="prose prose-lg md:prose-xl text-slate-600 leading-relaxed font-light">
                    <p>
                        I’m <span className="font-semibold text-slate-900">Soham Ghige</span>, a Bachelor’s student at <span className="font-semibold text-slate-900">IIT Roorkee</span>, passionate about
                        finance, technology, and data-driven investing.
                    </p>
                    <p className="mt-6">
                        With a strong foundation in economics, mathematics, and programming, I have
                        developed a portfolio advisory model designed to optimize investments
                        based on risk assessment, asset allocation, and market trends. My work
                        bridges the gap between financial expertise and technology, leveraging
                        quantitative analysis, AI-driven insights, and automation to simplify
                        investing for individuals and businesses.
                    </p>
                    <p className="mt-6">
                        I am committed to building innovative solutions that make wealth management smarter, more
                        accessible, and more efficient.
                    </p>
                </div>
            </motion.div>

            <footer className="w-full py-8 px-4 md:px-16 lg:px-24 border-t border-slate-200 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center">
                        <span className="text-lg font-serif font-bold text-slate-900 mr-2">SYLVA™</span>
                        <Footer.Copyright href="#" by="All Rights Reserved" year={2024} className="text-slate-500 text-sm" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="#" className="hover:text-slate-900 transition-colors">About</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Licensing</Link>
                        <Link to="#" className="hover:text-slate-900 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
