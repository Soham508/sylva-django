import React from "react";

type StockEntry = {
    "%_of_portfolio": number;
    investment_amount: number;
    quantity?: number;
    price_per_share?: number;
};

type PortfolioData = {
    [ticker: string]: StockEntry;
};

interface PortfolioTableProps {
    data: PortfolioData;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left font-medium text-slate-500 uppercase tracking-wider">Stock Ticker</th>
                        <th className="px-6 py-4 text-right font-medium text-slate-500 uppercase tracking-wider">% Portfolio</th>
                        <th className="px-6 py-4 text-right font-medium text-slate-500 uppercase tracking-wider">Amount (₹)</th>
                        <th className="px-6 py-4 text-right font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-right font-medium text-slate-500 uppercase tracking-wider">Price (₹)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {Object.entries(data).map(([ticker, details]) => (
                        <tr key={ticker} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 border-r border-slate-50">{ticker}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{details["%_of_portfolio"].toFixed(2)}%</td>
                            <td className="px-6 py-4 text-right text-slate-600">{details.investment_amount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{details.quantity ? details.quantity.toFixed(4) : "N/A"}</td>
                            <td className="px-6 py-4 text-right text-slate-600">{details.price_per_share ? details.price_per_share.toFixed(2) : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;
