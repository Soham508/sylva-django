import { Footer } from "flowbite-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Globe } from "lucide-react";

const Home = () => {
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
        <div className="w-full overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col justify-center px-4 md:px-16 lg:px-24 pt-20 pb-12">
                <motion.div
                    variants={fadeIn("up", 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight text-slate-900 leading-[1.1] mb-8">
                        Rooted in Strategy,<br />
                        <span className="text-slate-500">Growing with Vision.</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-600 max-w-2xl font-light leading-relaxed mb-10">
                        We specialize in crafting innovative equity solutions that empower our clients to achieve sustainable financial growth through precision and foresight.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/about" className="inline-flex items-center justify-center px-8 py-4 text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all duration-300 group">
                            Our Philosophy
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 text-slate-900 border border-slate-300 rounded-full hover:bg-slate-50 transition-all duration-300">
                            Get in Touch
                        </Link>
                    </div>
                </motion.div>

                {/* Abstract Background Element */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40vw] h-[40vw] bg-gradient-to-br from-slate-200/50 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
            </section>

            {/* Features / Value Props */}
            <section className="py-20 px-4 md:px-16 lg:px-24 bg-white rounded-3xl mx-2 md:mx-6 shadow-sm">
                <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-12"
                >
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6 text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-serif font-medium text-slate-900">Strategic Growth</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Through expertly curated portfolios and market insights, we help investors maximize returns and build long-term wealth.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-serif font-medium text-slate-900">Risk Management</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Our forward-thinking approach ensures investments create a secure future, tailored to unique client goals.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6 text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-serif font-medium text-slate-900">Global Insight</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Navigate complex markets with precision using our comprehensive global market analysis and research.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Commitment Section */}
            <section className="py-24 px-4 md:px-16 lg:px-24">
                <motion.div
                    variants={fadeIn("up", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-6">
                            A partnership built on trust and performance.
                        </h2>
                    </div>
                    <div>
                        <p className="text-lg text-slate-600 leading-relaxed mb-6">
                            At Sylva, we believe that true financial success comes from a deep understanding of market dynamics combined with a steadfast commitment to our clients' values.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Whether you are an individual investor or a large institution, our team is dedicated to providing the clarity and strategy you need to thrive in an ever-evolving aesthetic.
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="mt-12 py-12 px-4 md:px-16 lg:px-24 border-t border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-serif font-bold text-slate-900 mb-2">SYLVA™</span>
                        <Footer.Copyright href="#" by="All Rights Reserved" year={new Date().getFullYear()} className="text-slate-500" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-600">
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

export default Home;