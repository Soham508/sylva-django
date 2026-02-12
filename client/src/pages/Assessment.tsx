import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { ArrowLeft, ArrowRight, Check, Coins } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Assessment = () => {

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [Error, setError] = useState<ErrorState>({ show: false, error: "" });

    type ErrorState = {
        error?: string;
        show: boolean;
    }
    type RiskOption = {
        value: string;
        score: number;
    };

    type RiskState = {
        questions: RiskOption[];
        tickers: string[];
        Investment_ammount: number;
    };

    type Option = {
        label: string;
        score: number;
    };

    type Question = {
        question: string;
        options: Option[];
    };

    type Sheet = Question[];
    interface tickerOptions {
        label: string;
        ticker: string;
    }

    const generate_A = async (riskState: RiskState) => {
        const body = {
            questions: [...riskState.questions]
        };

        try {
            const response = await axios.post('https://sylva-django.onrender.com/api/risk_aversion/', body);
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
            const response = await axios.post('https://sylva-django.onrender.com/api/generate_portfolio/', body);
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
                const response = await axios.patch(`https://sylva-django.onrender.com/api/users/`, requestBody);
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
        questions: [{ value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: 3 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },
        { value: "''", score: -1 },],
        tickers: [
            "SUNPHARMA.NS",
            "DRREDDY.NS",
            "CIPLA.NS",
            "POLYMED.NS",
            "RELIANCE.NS",
            "NTPC.NS",
            "COALINDIA.NS",
            "ADANIPOWER.NS",
            "BPCL.NS",
            "GSPL.NS",
            "ITC.NS",
            "BRITANNIA.NS",
            "COLPAL.NS",
            "BALRAMCHIN.NS",
            "NAVNETEDUL.NS"
        ],
        Investment_ammount: 0
    });

    const tickers: { question: string; options: tickerOptions[] } = {
        "question": "Q.16 Which of the following stocks would you prefer not to include in your portfolio? (Select all that apply)",
        "options": [
            { label: "Sun Pharmaceutical Industries", ticker: "SUNPHARMA.NS" },
            { label: "Dr Reddy's Laboratories", ticker: "DRREDDY.NS" },
            { label: "Cipla", ticker: "CIPLA.NS" },
            { label: "Poly Medicure Ltd", ticker: "POLYMED.NS" },
            { label: "Reliance Industries Limited", ticker: "RELIANCE.NS" },
            { label: "National Thermal Power Corporation Ltd", ticker: "NTPC.NS" },
            { label: "Coal India Ltd", ticker: "COALINDIA.NS" },
            { label: "Adani Power", ticker: "ADANIPOWER.NS" },
            { label: "Bharat Petroleum Corporation Ltd", ticker: "BPCL.NS" },
            { label: "Gujarat State Petronet Ltd", ticker: "GSPL.NS" },
            { label: "ITC Limited", ticker: "ITC.NS" },
            { label: "Britannia Ltd", ticker: "BRITANNIA.NS" },
            { label: "Colgate-Palmolive (India) Ltd", ticker: "COLPAL.NS" },
            { label: "Balrampur Chini Mills Limited", ticker: "BALRAMCHIN.NS" },
            { label: "Navneet Education Ltd", ticker: "NAVNETEDUL.NS" }
        ]
    }

    const sheet: Sheet = [
        {
            "question": "Q.1 Which of the following best describes your current stage of life?",
            "options": [
                { label: "You have zero financial burden and are in your earliest stage of investing.", score: 5 },
                { label: "You have high financial responsibility and are building wealth.", score: 3 },
                { label: "You have accumulated wealth and stable income but are still investing for future goals.", score: 7 },
                { label: "You are retired/close to retirement with accumulated wealth and little/no financial burden.", score: 9 }
            ]
        },
        {
            "question": "Q.2 How would you describe your current income stability and career stage?",
            "options": [
                { label: "Just starting in my career, with fluctuating income.", score: 3 },
                { label: "Established in my career with a steady income.", score: 5 },
                { label: "I am approaching a peak in my career, with high income and stability.", score: 9 },
                { label: "Nearing retirement, focusing on maintaining my income.", score: 7 },
                { label: "No income stream, have some deposits.", score: 1 }
            ]
        }, {
            "question": "Q.3 If your current source of income were to stop today, how long would your present savings support you? (optional/conditional)",
            "options": [
                { label: "Less than 3 months", score: 2 },
                { label: "3 - 6 months", score: 4 },
                { label: "6 months to a year", score: 6 },
                { label: "More than 1 year", score: 8 }
            ]
        },
        {
            "question": "Q.4 You have to support financially:",
            "options": [
                { label: "Only myself", score: 9 },
                { label: "Two people including myself", score: 7 },
                { label: "2 - 4 people other than myself", score: 5 },
                { label: "More than four people other than myself", score: 3 }
            ]
        },
        {
            "question": "Q.5 Which of these objectives is the most important to you from an investment perspective?",
            "options": [
                { label: "Preserving wealth", score: 2 },
                { label: "Generating regular income to meet current requirements", score: 4 },
                { label: "Balance current income and long-term growth", score: 6 },
                { label: "Long-term growth", score: 8 }
            ]
        },
        {
            "question": "Q.6 What percentage of your income you generally invest in equity markets?",
            "options": [
                { label: "Income %", score: 30 }
            ]
        },
        {
            "question": "Q.7 At the beginning of the year, you invest Rs.1,00,000 for the long term. At the end of year one, there are four possible outcomes (best and worst-case scenarios). Which option would you be prepared to accept?",
            "options": [
                { label: "Portfolio A: Rs. 1,00,000", score: 3 },
                { label: "Portfolio B: Rs. 90,000 - Rs. 1,10,000", score: 5 },
                { label: "Portfolio C: Rs. 80,000 - Rs. 1,20,000", score: 7 },
                { label: "Portfolio D: Rs. 70,000 - Rs. 1,30,000", score: 9 }
            ]
        },
        {
            "question": "Q.8 How comfortable are you taking financial risks to help ensure you achieve your longer-term needs and objectives?",
            "options": [
                { label: "Not at all comfortable", score: 3 },
                { label: "Slightly comfortable", score: 5 },
                { label: "Comfortable", score: 7 },
                { label: "Very comfortable", score: 9 }
            ]
        },
        {
            "question": "Q.9 How long are you looking at investing your capital before accessing it? (Assuming you already have a plan to meet short-term cash flow or emergencies.)",
            "options": [
                { label: "In 2 years or less", score: 5 },
                { label: "Within 3 - 5 years", score: 6 },
                { label: "Within 6 - 10 years", score: 7 },
                { label: "Not for 10+ years", score: 8 }
            ]
        },
        {
            "question": "Q.10 If your investments increased 12% (a to b) in year one, then 18% (b to c) in year two, what are you most likely to do in year three?",
            "options": [
                { label: "You would buy more with those capital gains.", score: 8 },
                { label: "You would hold your portfolio.", score: 6 },
                { label: "You would sell your stocks at a profit and take an exit position.", score: 4 }
            ]
        }
    ];

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
                            {page <= 10 && sheet.map((q, i) => (
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
                                        {tickers.options.map((option, index) => {
                                            const isIncluded = riskState.tickers.includes(option.ticker);
                                            // Logic: If included in array, it is NOT excluded. 
                                            // The user selects items to EXCLUDE. 
                                            // If selected (Excluded), it should look "Active".
                                            // So !isIncluded means it is Excluded (Active).
                                            const isExcluded = !isIncluded;

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        if (isIncluded) {
                                                            // Currently Included. User clicks to Exclude (Remove from array).
                                                            setRiskState(prev => ({
                                                                ...prev,
                                                                tickers: prev.tickers.filter(t => t !== option.ticker)
                                                            }));
                                                        } else {
                                                            // Currently Excluded. User clicks to Include (Add back to array).
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
