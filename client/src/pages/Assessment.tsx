import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ArrowLeft, ArrowRight, Check, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { questions, tickerQuestion } from "@/constants/assessmentData";
import { API_BASE_URL } from "@/constants";

// Re-exporting types for local usage if needed, or just using imports
type RiskOption = {
    value: string;
    score: number;
};

type RiskState = {
    questions: RiskOption[];
    tickers: string[];
    Investment_ammount: number;
};

const Assessment = () => {

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [Error, setError] = useState<{ error?: string; show: boolean }>({ show: false, error: "" });


    const generate_A = async (riskState: RiskState) => {
        const body = {
            questions: [...riskState.questions]
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/risk_aversion/`, body);
            return response.data.risk_tolerance_score
        } catch (error) {
            console.error('Error making POST request:', error);
            return;
        }
    };

    const generate_portfolio = async (riskState: RiskState) => {
        const tickers = riskState.tickers
        const wealth = (riskState.Investment_ammount == 0 ? 100 : riskState.Investment_ammount);
        const risk_tolerance_score = await generate_A(riskState);

        const body = {
            a: risk_tolerance_score,
            stocks: tickers,
            wealth: wealth
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/generate_portfolio/`, body);
            const initial_portfolio = response.data.initial_portfolio;
            const target_portfolio = response.data.target_portfolio;
            const actions = response.data.actions;

            const email = currentUser?.email
            const requestBody = {
                initial_portfolio,
                target_portfolio,
                actions,
                riskState,
                email,
                A: risk_tolerance_score
            };

            try {
                const response = await axios.patch(`${API_BASE_URL}/api/users/`, requestBody);
                if (response.data.success) {
                    navigate('/')
                }
            } catch (error) {
                console.log('Error updating portfolio:', error);
            }
            return response.data;

        } catch (error) {
            console.error('Error making POST request to /process:', error);
            return null;
        }
    };

    const [riskState, setRiskState] = useState<RiskState>({
        questions: Array(10).fill({ value: "''", score: -1 }).map((_, i) => i === 5 ? { value: "''", score: 3 } : { value: "''", score: -1 }),
        tickers: [
            "SUNPHARMA.NS", "DRREDDY.NS", "CIPLA.NS", "POLYMED.NS", "RELIANCE.NS",
            "NTPC.NS", "COALINDIA.NS", "ADANIPOWER.NS", "BPCL.NS", "GSPL.NS",
            "ITC.NS", "BRITANNIA.NS", "COLPAL.NS", "BALRAMCHIN.NS", "NAVNETEDUL.NS"
        ],
        Investment_ammount: 0
    });

    const handleSubmit = async () => {
        try {
            await generate_portfolio(riskState);
            navigate('/dashboard');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 md:px-8 font-sans">
            <div className="max-w-3xl w-full bg-white rounded-3xl rounded-t-sm shadow-xl border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
                <div className="w-full bg-slate-50 h-2">
                    <div
                        className="bg-slate-900 h-2 transition-all duration-500 ease-out"
                        style={{ width: `${(page / 12) * 100}%` }}
                    />
                </div>

                <div className="flex-grow p-8 md:p-12 flex flex-col">
                    <div className="flex justify-between items-center mb-8 text-slate-400 text-sm font-medium uppercase tracking-wider">
                        <span>Question {page} / 12</span>
                        <span>Risk Assessment</span>
                    </div>

                    <div className="flex-grow flex flex-col justify-center relative">
                        <AnimatePresence mode="wait">
                            {page <= 10 && questions.map((q, i) => (
                                i === page - 1 && (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex flex-col gap-6"
                                    >
                                        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 leading-tight">
                                            {q.question}
                                        </h2>

                                        <div className="flex flex-col gap-3 mt-4">
                                            {q.options.map((option, optIdx) => (
                                                option.label === "Income %" ? (
                                                    <div key={optIdx} className="w-full py-8">
                                                        <div className="flex justify-between items-end mb-4">
                                                            <span className="text-6xl font-serif text-slate-900">
                                                                {Math.round(riskState.questions[i].score * 10)}%
                                                            </span>
                                                            <span className="text-slate-500 mb-2 font-medium">of income allocated</span>
                                                        </div>
                                                        <Slider
                                                            defaultValue={[30]}
                                                            value={[riskState.questions[i].score * 10]}
                                                            max={100}
                                                            step={10}
                                                            className="w-full py-4"
                                                            onValueChange={(val) => {
                                                                setRiskState(prev => ({
                                                                    ...prev,
                                                                    questions: prev.questions.map((q, idx) =>
                                                                        idx === i ? { ...q, score: val[0] / 10 } : q
                                                                    )
                                                                }))
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={optIdx}
                                                        onClick={() => {
                                                            setRiskState((prev) => ({
                                                                ...prev,
                                                                questions: prev.questions.map((question, index) =>
                                                                    index === i ? { value: option.label, score: option.score } : question
                                                                )
                                                            }));
                                                        }}
                                                        className={`
                                                            group flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer
                                                            ${riskState.questions[i]?.value === option.label
                                                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'}
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors
                                                            ${riskState.questions[i]?.value === option.label ? 'border-white bg-white' : 'border-slate-300 group-hover:border-slate-400'}
                                                        `}>
                                                            {riskState.questions[i]?.value === option.label && (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                                                            )}
                                                        </div>
                                                        <span className="text-lg font-medium">{option.label}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </motion.div>
                                )
                            ))}

                            {page === 11 && (
                                <motion.div
                                    key="tickers"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col h-full"
                                >
                                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 leading-tight mb-6">
                                        Which stocks would you prefer to <span className="underline decoration-red-500/30 decoration-4 underline-offset-4">exclude</span> from your portfolio?
                                    </h2>
                                    <p className="text-slate-500 mb-6">Select all that apply. Selected stocks will represent exclusions.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                        {tickerQuestion.options.map((option, index) => {
                                            const isIncluded = riskState.tickers.includes(option.ticker);
                                            const isExcluded = !isIncluded;

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (isIncluded) {
                                                            setRiskState(prev => ({
                                                                ...prev,
                                                                tickers: prev.tickers.filter(t => t !== option.ticker)
                                                            }));
                                                        } else {
                                                            setRiskState(prev => ({
                                                                ...prev,
                                                                tickers: [...prev.tickers, option.ticker]
                                                            }));
                                                        }
                                                    }}
                                                    className={`
                                                        p-4 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border flex justify-between items-center
                                                        ${isExcluded
                                                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'}
                                                    `}
                                                >
                                                    {option.label}
                                                    {isExcluded && <Check size={16} className="text-white" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {page === 12 && (
                                <motion.div
                                    key="amount"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col gap-6 justify-center h-full py-12"
                                >
                                    <h2 className="text-2xl md:text-3xl font-serif text-slate-900 leading-tight mb-8 text-center">
                                        What is your investment corpus?
                                    </h2>

                                    <div className="max-w-md w-full mx-auto">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Coins className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={riskState.Investment_ammount || ''}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    setRiskState(prev => ({ ...prev, Investment_ammount: isNaN(val) ? 0 : val }));
                                                }}
                                                placeholder="Enter amount"
                                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-0 border-b-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-0 focus:border-slate-900 text-xl transition-colors font-serif"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <span className="text-slate-400 font-medium">INR</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-center text-slate-500 text-sm">
                                            This amount will be used to generate your initial portfolio allocation.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                        {page > 1 ? (
                            <button
                                onClick={() => setPage(p => p - 1)}
                                className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
                            >
                                <ArrowLeft size={20} className="mr-2" /> Back
                            </button>
                        ) : <div />}

                        {page < 12 ? (
                            <button
                                onClick={() => {
                                    if (page < 11 && riskState.questions[page - 1].score == -1) {
                                        setError({ show: true, error: "Please answer the question!" });
                                        setTimeout(() => {
                                            setError({ show: false, error: "" });
                                        }, 3000);
                                        return;
                                    }
                                    setPage(p => p + 1)
                                }}
                                className="flex items-center bg-slate-900 text-white px-4 py-2 rounded-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-300 active:scale-95"
                            >
                                Next <ArrowRight size={20} className="ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center bg-slate-900 text-white px-8 py-3 rounded-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-300 active:scale-95"
                            >
                                Generate Portfolio
                            </button>
                        )}
                    </div>
                    {Error.show && <p className="text-red-500 mt-2 text-center font-semibold text-md">{Error.error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Assessment;
