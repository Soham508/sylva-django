import React from "react";

type StockEntry = {
    "%_of_portfolio": number;
    investment_amount: number;
    quantity?: number;
    price_per_share?: number;
};

interface Portfolio {
    initial_portfolio: Record<string, StockEntry>;
    target_portfolio: Record<string, StockEntry>;
    actions: Record<string, { action: string; quantity: number }>;
}

const PortfolioChangeTable: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm text-center">
                <thead className="bg-slate-50">
                    <tr>
                        <th rowSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">Stock</th>
                        <th colSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider border-b border-r border-slate-200">Quantity</th>
                        <th colSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider border-b border-r border-slate-200">Amount (₹)</th>
                        <th colSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider border-b border-r border-slate-200">% Portfolio</th>
                        <th rowSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider border-r border-slate-200">Action</th>
                        <th rowSpan={2} className="px-4 py-3 font-medium text-slate-500 uppercase tracking-wider">Change</th>
                    </tr>
                    <tr>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-100">Before</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-200">After</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-100">Before</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-200">After</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-100">Before</th>
                        <th className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase border-r border-slate-200">After</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {Object.keys(portfolio.initial_portfolio).map((asset) => {
                        const action = portfolio.actions[asset]?.action;
                        const isSell = action === "sell";
                        const isBuy = action === "buy";

                        return (
                            <tr key={asset} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900 border-r border-slate-50 text-left">{asset}</td>

                                <td className="px-4 py-3 text-slate-600 border-r border-slate-50">{portfolio.initial_portfolio[asset].quantity ? portfolio.initial_portfolio[asset].quantity.toFixed(4) : '-'}</td>
                                <td className="px-4 py-3 text-slate-900 font-medium border-r border-slate-50 bg-slate-50/50">{portfolio.target_portfolio[asset].quantity ? portfolio.target_portfolio[asset].quantity.toFixed(4) : '-'}</td>

                                <td className="px-4 py-3 text-slate-600 border-r border-slate-50">{portfolio.initial_portfolio[asset].investment_amount.toLocaleString('en-IN')}</td>
                                <td className="px-4 py-3 text-slate-900 font-medium border-r border-slate-50 bg-slate-50/50">{portfolio.target_portfolio[asset].investment_amount.toLocaleString('en-IN')}</td>

                                <td className="px-4 py-3 text-slate-600 border-r border-slate-50">{portfolio.initial_portfolio[asset]["%_of_portfolio"].toFixed(2)}%</td>
                                <td className="px-4 py-3 text-slate-900 font-medium border-r border-slate-50 bg-slate-50/50">{portfolio.target_portfolio[asset]["%_of_portfolio"].toFixed(2)}%</td>

                                <td className={`px-4 py-3 font-semibold uppercase text-xs border-r border-slate-50 ${isSell ? 'text-red-600' : isBuy ? 'text-green-600' : 'text-slate-400'}`}>
                                    {action || "-"}
                                </td>
                                <td className={`px-4 py-3 font-medium ${isSell ? 'text-red-600' : isBuy ? 'text-green-600' : 'text-slate-400'}`}>
                                    {(isSell && portfolio.actions[asset]?.quantity?.toFixed(2) != '0.00')
                                        ? `-${portfolio.actions[asset]?.quantity.toFixed(4)}`
                                        : isBuy ? `+${portfolio.actions[asset]?.quantity?.toFixed(4)}` : "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioChangeTable;
