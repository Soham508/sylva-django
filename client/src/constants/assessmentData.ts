export type Option = {
    label: string;
    score: number;
};

export type Question = {
    question: string;
    options: Option[];
};

export type TickerOption = {
    label: string;
    ticker: string;
};

export const questions: Question[] = [
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

export const tickerQuestion: { question: string; options: TickerOption[] } = {
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
};
