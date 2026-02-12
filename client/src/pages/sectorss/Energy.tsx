import energyGraph from "./../../assets/energy_graph.jpg"
import { MdPictureAsPdf } from "react-icons/md";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Energy = () => {
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
                                Energy Sector
                            </h1>
                            <div className="w-20 h-1 bg-slate-900 mb-8" />
                            <p className="text-lg text-slate-600 leading-relaxed font-light">
                                The Indian energy sector is a critical component of the global
                                energy landscape, being the third-largest consumer of energy
                                globally. With the country's demand for energy projected to nearly
                                double by 2040, India’s energy market is undergoing rapid expansion,
                                supported by significant infrastructure development and investments.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed font-light mt-4">
                                In 2020, the country’s total energy market was valued at
                                approximately USD 160 billion, and it is expected to grow at a 5-6%
                                CAGR, driven by strong industrial demand, urbanization, and the
                                government’s focus on energy security.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed font-light mt-4">
                                The renewable energy capacity is expected to exceed 500 GW by 2030,
                                as the government pushes for decarbonization and aims to meet 50% of
                                its energy needs from renewable sources.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-serif font-medium text-slate-900 mb-6 border-b pb-2">Key Reports</h3>
                            <div className="space-y-4">
                                <a
                                    href="/reports/Equity_Report_Energy.pdf"
                                    download="Equity_Report_Energy"
                                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">Equity Report</span>
                                        <span className="text-xs text-slate-500">PDF Document</span>
                                    </div>
                                    <MdPictureAsPdf className="text-slate-400 group-hover:text-red-500 transition-colors w-6 h-6" />
                                </a>

                                <a
                                    href="/reports/Sector_Report_Energy.pdf"
                                    download="Sector_Report_Energy"
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
                                    src={energyGraph}
                                    alt="Energy Sector Analysis Graph"
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

export default Energy;
