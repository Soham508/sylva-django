/* eslint-disable react-refresh/only-export-components */
import fmcgGraph from "./../../assets/fmcg_graph.jpg";
import { MdPictureAsPdf } from "react-icons/md";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const FMCG = () => {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full flex-grow">
                <Link to="/research" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Research
                </Link>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 mb-6">
                                FMCG Sector
                            </h1>
                            <div className="w-20 h-1 bg-slate-900 mb-8" />
                            <p className="text-lg text-slate-600 leading-relaxed font-light">
                                The FMCG sector is the 4th largest sector in the economy and is expected
                                to reach USD 220 billion by 2025, growing from around USD 110
                                billion in 2020. This sector is driven by rapid urbanization, rising
                                disposable incomes, and increasing rural consumption, with rural
                                areas accounting for over 36% of FMCG consumption.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed font-light mt-4">
                                Key segments include food and beverages, personal care, household products, and
                                health and hygiene. The growth of e-commerce and digital penetration
                                has further expanded market reach, enabling brands to connect with a
                                diverse and expanding consumer base.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed font-light mt-4">
                                The sector is largely divided into food & beverages, household &
                                personal care, and healthcare products. However, challenges include
                                rising input costs, increasing competition, and regulatory changes
                                like the implementation of GST and sustainability mandates.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-serif font-medium text-slate-900 mb-6 border-b pb-2">Key Reports</h3>
                            <div className="space-y-4">
                                <a
                                    href="/reports/Equity_Report_FMCG.pdf"
                                    download="Equity_Report_FMCG"
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">Equity Report</span>
                                        <span className="text-xs text-slate-500">PDF Document</span>
                                    </div>
                                    <MdPictureAsPdf className="text-slate-400 group-hover:text-red-500 transition-colors w-6 h-6" />
                                </a>

                                <a
                                    href="/reports/Sector_Report_FMCG.pdf"
                                    download="Sector_Report_FMCG"
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">Sector Overview</span>
                                        <span className="text-xs text-slate-500">PDF Document</span>
                                    </div>
                                    <MdPictureAsPdf className="text-slate-400 group-hover:text-red-500 transition-colors w-6 h-6" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="sticky top-24">
                            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white p-2 border border-slate-100">
                                <img
                                    src={fmcgGraph}
                                    alt="FMCG Sector Analysis Graph"
                                    className="w-full h-auto rounded-xl"
                                />
                            </div>
                            <p className="text-center text-sm text-slate-400 mt-4 italic">
                                Market trend analysis 2020-2024
                            </p>
                        </div>
                    </div>
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

export default FMCG;
