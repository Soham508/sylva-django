/* eslint-disable @typescript-eslint/no-unused-vars */
import PortfolioChangeTable from "@/components/PortfolioChangeTable";
import PortfolioTable from "@/components/PortfolioTable";
import { useEffect, useState } from "react";
import { Mosaic } from "react-loading-indicators"
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Pie_Chart from "@/components/Pie_Chart";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Briefcase, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { API_BASE_URL } from "@/constants";

export interface Portfolio {
    initial_portfolio: StockPortfolio;
    target_portfolio: StockPortfolio;
    actions: Record<string, { action: string; quantity: number }>;
}

export interface StockPortfolio {
    [key: string]: StockEntry
}

interface Err {
    message: string,
    error: boolean
}

export type StockEntry = {
    "%_of_portfolio": number;
    investment_amount: number;
    quantity?: number;
    price_per_share?: number;
};

export interface PieChartData {
    [key: string]: {
        "%_of_portfolio": number;
        investment_amount?: number;
        quantity?: number;
        price_per_share?: number;
    }
}
const emptyPortfolio: Portfolio = {
    initial_portfolio: {
        "SUNPHARMA.NS": {
            "%_of_portfolio": 8.140349464032543,
            "investment_amount": 814034.9464032543,
            "quantity": 451.338965082209,
            "price_per_share": 1803.5999755859373
        }
    },
    target_portfolio: {
        "SUNPHARMA.NS": {
            "%_of_portfolio": 8.140349464032543,
            "investment_amount": 814034.9464032543,
            "quantity": 451.338965082209,
            "price_per_share": 1803.5999755859373
        }
    },
    actions: {}
};

function calculateTotalChangeValue(portfolioData: Portfolio): number {
    const actions = portfolioData.actions;
    const initialPortfolio = portfolioData.initial_portfolio;
    let totalValue = 0;
    for (const stockSymbol in actions) {
        if (Object.prototype.hasOwnProperty.call(actions, stockSymbol)) {
            const stockAction = actions[stockSymbol];
            const stockDetails = initialPortfolio[stockSymbol];
            if (stockDetails && stockAction.quantity) {
                const price = stockDetails.price_per_share;
                const quantityChange = stockAction.quantity;
                const calculatedValue = price ? price * quantityChange * 0.003 : 0;
                totalValue += calculatedValue;
            }
        }
    }
    return totalValue;
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Err>({ message: '', error: false });
    const [rebalance, setRebalance] = useState(false);
    const [portfolioData, setPortfolioData] = useState<Portfolio | undefined>(undefined);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const getUserPortfolio = async () => {
        try {
            const email = currentUser?.email || '';
            const res = await axios.get(
                `${API_BASE_URL}/api/users/?email=${email}`
            );
            console.log(res.data)
            if (res.data.success) {
                if (res.data.user.A == -1) {
                    setError({
                        message: "Please complete your risk assessment first",
                        error: true,
                    });
                } else {
                    setError({ message: "", error: false })
                    const portfolio: Portfolio = { initial_portfolio: res.data.user.initial_portfolio, target_portfolio: res.data.user.target_portfolio, actions: res.data.user.actions }
                    setPortfolioData(portfolio);
                }
                setLoading(false);
                return;
            }
        } catch (err) {
            console.log(err);
            setError({ message: "Error fetching user portfolio", error: true });
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.email) {
            getUserPortfolio();
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
                <Mosaic color={["#0f172a", "#334155", "#64748b"]} speedPlus={-1} easing="ease-in-out" />
                <h2 className="text-xl font-serif text-slate-700 animate-pulse">Generating your personalized portfolio...</h2>
            </div>
        );
    }

    if (error.error) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-md w-full border border-slate-100">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="text-red-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-2">Action Required</h2>
                    <p className="text-slate-600 mb-8">{error.message}</p>
                    <button
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-300 w-full font-medium"
                        onClick={() => navigate("/assessment")}
                    >
                        Start Assessment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50/50 flex flex-col">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-medium text-slate-900 mb-2">
                            Investment Portfolio
                        </h1>
                        <p className="text-slate-500">Manage and analyze your asset allocation</p>
                    </div>

                    {!rebalance ? (
                        <button
                            onClick={() => setRebalance(true)}
                            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                        >
                            <RefreshCw size={18} /> Rebalance
                        </button>
                    ) : (
                        <button
                            onClick={() => setRebalance(false)}
                            className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            <Briefcase size={18} /> View Portfolio
                        </button>
                    )}
                </div>

                {!rebalance ? (
                    <div className="flex flex-col gap-10">
                        {/* Top Section: Distribution Visualization */}
                        <div className="self-center w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-medium text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
                                <PieChartIcon className="text-slate-400" size={24} />
                                Portfolio Distribution
                            </h2>
                            <div className="flex justify-center w-full">
                                <div className="max-w-xl w-full">
                                    <Pie_Chart />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Detailed Table */}
                        <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                                <Briefcase className="text-slate-400" size={24} />
                                <h2 className="text-xl font-medium text-slate-900">Current Allocation Details</h2>
                            </div>
                            <div className="w-full">
                                <PortfolioTable data={portfolioData?.initial_portfolio || {}} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl mb-8 flex flex-row justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <TrendingUp className="text-green-400 w-8 h-8" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-300 text-sm">Estimated Transaction Cost</span>
                                    <span className="text-3xl font-serif font-medium">
                                        ₹ {calculateTotalChangeValue(portfolioData ? portfolioData : emptyPortfolio).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right hidden md:block">
                                <span className="block text-slate-300 text-sm">Action Type</span>
                                <span className="block font-medium">Rebalancing</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-serif font-medium text-slate-900 mb-6">Recommended Actions</h3>
                            <PortfolioChangeTable portfolio={portfolioData || emptyPortfolio} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard