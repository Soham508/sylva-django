import React from "react";

type StockEntry = {
    "%_of_portfolio": number;
    investment_amount: number;
    quantity?: number; // Optional since "Risk_Free" may not have it
    price_per_share?: number; // Optional since "Risk_Free" may not have it
};

interface Portfolio {
    initial_portfolio: Record<string, StockEntry>;
    target_portfolio: Record<string, StockEntry>;
    actions: Record<string, { action: string; quantity: number }>;
}

const PortfolioTable: React.FC<{ portfolio: Portfolio }> = ({ portfolio }) => {
    return (
        <table className="min-w-full border bg-black/90 border-gray-300 rounded-xl overflow-y-auto">
            <thead className="">
                <tr>
                    <th rowSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Stock Ticker</th>
                    <th colSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Shares Quantity</th>
                    <th colSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Total Amount</th>
                    <th colSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">% of Portfolio</th>
                    <th rowSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Action</th>
                    <th rowSpan={2} className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Action Quantity</th>
                </tr>
                <tr>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Before Rebalancing</th>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">After Rebalancing</th>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Before Rebalancing</th>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">After Rebalancing</th>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">Before Rebalancing</th>
                    <th className="  bg-black border border-slate-200 text-slate-100 px-4 py-2">After Rebalancing</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(portfolio.initial_portfolio).map((asset) => (
                    <tr key={asset}>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">{asset}</td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.initial_portfolio[asset].quantity ? portfolio.initial_portfolio[asset].quantity.toFixed(4) : 'NA'}
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.target_portfolio[asset].quantity ? portfolio.target_portfolio[asset].quantity.toFixed(4) : 'NA'}
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.initial_portfolio[asset].investment_amount.toLocaleString()}
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.target_portfolio[asset].investment_amount.toLocaleString()}
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.initial_portfolio[asset]["%_of_portfolio"].toFixed(2)}%
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.target_portfolio[asset]["%_of_portfolio"].toFixed(2)}%
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {portfolio.actions[asset]?.action || "N/A"}
                        </td>
                        <td className="border border-slate-200 text-slate-100 px-4 py-2">
                            {(portfolio.actions[asset]?.action === "sell" && portfolio.actions[asset]?.quantity?.toFixed(2) != '0.00')
                                ? `-${portfolio.actions[asset]?.quantity.toFixed(4)}`
                                : portfolio.actions[asset]?.quantity?.toFixed(2) || "N/A"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PortfolioTable;
