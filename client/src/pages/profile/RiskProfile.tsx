/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Mosaic } from "react-loading-indicators";
import { questions, tickerQuestion } from "@/constants/assessmentData";
import { API_BASE_URL } from "@/constants";
import { Slider } from "@/components/ui/slider";
import { Check, Coins, Save, AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type RiskOption = {
    value: string;
    score: number;
};

type RiskState = {
    questions: RiskOption[];
    tickers: string[];
    Investment_ammount: number;
};

const RiskProfile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [userA, setUserA] = useState<number>(-1);

    // Initial state matching Assessment
    const [riskState, setRiskState] = useState<RiskState>({
        questions: Array(10).fill({ value: "''", score: -1 }),
        tickers: [],
        Investment_ammount: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser?.email) return;
            try {
                const res = await axios.get(`${API_BASE_URL}/api/users/?email=${currentUser.email}`);
                if (res.data.success) {
                    const user = res.data.user;
                    setUserA(user.A);

                    if (user.riskState && user.riskState.questions) {
                        setRiskState(user.riskState);
                    } else {
                        // If no risk state but A exists (legacy?), or first time
                        if (user.A !== -1) {
                            // This is odd, but handle gracefully
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    const getRiskCategory = (a: number) => {
        if (a >= 5) return { label: "Risk Averse (Conservative)", color: "text-green-600", bg: "bg-green-50" };
        if (a >= 3) return { label: "Risk Neutral (Balanced)", color: "text-blue-600", bg: "bg-blue-50" };
        return { label: "Risk Lover (Aggressive)", color: "text-orange-600", bg: "bg-orange-50" };
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            // 1. Calculate A
            const riskScoreRes = await axios.post(`${API_BASE_URL}/api/risk_aversion/`, {
                questions: riskState.questions
            });
            const newA = riskScoreRes.data.risk_tolerance_score;

            // 2. Generate Portfolio
            const portfolioRes = await axios.post(`${API_BASE_URL}/api/generate_portfolio/`, {
                a: newA,
                stocks: riskState.tickers,
                wealth: riskState.Investment_ammount || 100 // fallback
            });

            // 3. Update User
            const updateBody = {
                initial_portfolio: portfolioRes.data.initial_portfolio,
                target_portfolio: portfolioRes.data.target_portfolio,
                actions: portfolioRes.data.actions,
                riskState: riskState,
                email: currentUser?.email,
                A: newA
            };

            const updateRes = await axios.patch(`${API_BASE_URL}/api/users/`, updateBody);

            if (updateRes.data.success) {
                setSuccess("Profile updated successfully!");
                setUserA(newA);
            } else {
                setError("Failed to update user profile.");
            }

        } catch (err) {
            console.error(err);
            setError("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
                <Mosaic color={["#0f172a", "#334155", "#64748b"]} />
            </div>
        );
    }

    if (userA === -1) {
        return (
            <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center max-w-md w-full border border-slate-100">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="text-yellow-600 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-2">Profile Not Set</h2>
                    <p className="text-slate-600 mb-8">You haven't completed your risk assessment yet.</p>
                    <button
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium"
                        onClick={() => navigate("/assessment")}
                    >
                        Start Assessment
                    </button>
                </div>
            </div>
        )
    }

    const loops = getRiskCategory(userA);

    return (
        <div className="w-full min-h-screen bg-slate-50/50 py-12 px-4 md:px-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                            <ArrowLeft size={18} className="mr-1" /> Back
                        </button>
                        <h1 className="text-3xl font-serif font-medium text-slate-900">Risk Profile</h1>
                        <p className="text-slate-500">View and update your investment preferences</p>
                    </div>

                    <div className={`px-6 py-4 rounded-2xl border ${loops.bg} border-slate-100 shadow-sm flex items-center gap-4`}>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Risk Score (A)</span>
                            <span className="text-3xl font-serif font-medium text-slate-900">{userA.toFixed(2)}</span>
                        </div>
                        <div className="h-10 w-px bg-slate-200 mx-2"></div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Category</span>
                            <span className={`font-medium ${loops.color}`}>{loops.label}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center">
                        <AlertTriangle size={20} className="mr-2" /> {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center">
                        <Check size={20} className="mr-2" /> {success}
                    </div>
                )}

                <div className="flex flex-col gap-8">
                    {/* Questions Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h2 className="text-xl font-medium text-slate-900">Assessment Responses</h2>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-10">
                            {questions.map((q, i) => (
                                <div key={i} className="flex flex-col gap-4">
                                    <h3 className="text-lg font-medium text-slate-900">{q.question}</h3>

                                    {/* Handle Slider for Q6 */}
                                    {q.options[0].label === "Income %" ? (
                                        <div className="py-4 px-2">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-3xl font-serif text-slate-900">
                                                    {Math.round(riskState.questions[i].score * 10)}%
                                                </span>
                                            </div>
                                            <Slider
                                                defaultValue={[30]}
                                                value={[riskState.questions[i].score * 10]}
                                                max={100}
                                                step={10}
                                                className="w-full"
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((option, optIdx) => (
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
                                                        p-3 rounded-xl border text-sm transition-all cursor-pointer flex items-center
                                                        ${riskState.questions[i]?.value === option.label
                                                            ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                                                    `}
                                                >
                                                    <div className={`
                                                        w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center
                                                        ${riskState.questions[i]?.value === option.label ? 'border-white bg-white' : 'border-slate-300'}
                                                    `}>
                                                        {riskState.questions[i]?.value === option.label && (
                                                            <div className="w-2 h-2 rounded-full bg-slate-900" />
                                                        )}
                                                    </div>
                                                    {option.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Excluded Stocks */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h2 className="text-xl font-medium text-slate-900">Excluded Stocks</h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tickerQuestion.options.map((option, index) => {
                                    const isIncluded = riskState.tickers.includes(option.ticker);
                                    const isExcluded = !isIncluded; // logic: list contains INCLUDED tickers, so missing means EXCLUDED? 
                                    // Wait, Assessment logic:
                                    // isIncluded = riskState.tickers.includes(option.ticker);
                                    // The logic in Assessment was: riskState.tickers contains INCLUDED. User selects to EXCLUDE (remove from array).
                                    // If !isIncluded, it is EXCLUDED.

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (isIncluded) {
                                                    // Exclude it (Remove from array)
                                                    setRiskState(prev => ({
                                                        ...prev,
                                                        tickers: prev.tickers.filter(t => t !== option.ticker)
                                                    }));
                                                } else {
                                                    // Include it (Add to array)
                                                    setRiskState(prev => ({
                                                        ...prev,
                                                        tickers: [...prev.tickers, option.ticker]
                                                    }));
                                                }
                                            }}
                                            className={`
                                                p-3 rounded-xl text-sm font-medium transition-all cursor-pointer border flex justify-between items-center
                                                ${isExcluded
                                                    ? 'bg-red-50 border-red-200 text-red-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                            `}
                                        >
                                            <span className={isExcluded ? 'line-through decoration-red-500/50' : ''}>{option.label}</span>
                                            {isExcluded && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Excluded</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Investment Amount */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h2 className="text-xl font-medium text-slate-900">Investment Corpus</h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Coins className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="number"
                                    value={riskState.Investment_ammount || ''}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setRiskState(prev => ({ ...prev, Investment_ammount: isNaN(val) ? 0 : val }));
                                    }}
                                    className="block w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-lg transition-colors font-serif"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 font-medium">INR</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-center bottom-4 w-full">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`
                                flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-md shadow-xl hover:bg-slate-800 transition-all active:scale-95
                                ${saving ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-slate-900/20'}
                            `}
                        >
                            {saving ? (
                                <>
                                    <Mosaic color={["#ffffff", "#ffffff", "#ffffff"]} size="small" /> Saving Checkpoints...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> Save Changes & Rebalance
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RiskProfile;