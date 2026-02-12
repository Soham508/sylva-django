type StockEntry = {
    "%_of_portfolio": number;
    investment_amount: number;
    quantity?: number; // Optional since "Risk_Free" may not have it
    price_per_share?: number; // Optional since "Risk_Free" may not have it
};

type PortfolioData = {
    [ticker: string]: StockEntry;
};

import React from "react";

interface PortfolioTableProps {
    data: PortfolioData;
}

const PortfolioTable: React.FC<PortfolioTableProps> = ({ data }) => {
    return (
        <div className="overflow-x-auto rounded-xl max-h-[500px]  overflow-y-auto">
            <table className="min-w-full bg-black/90 border border-gray-200">
                <thead className="sticky top-0">
                    <tr>
                        <th className="py-3 px-6 bg-black border border-slate-200 font-semibold text-slate-100 text-sm uppercase text-left border-b ">
                            Stock Ticker
                        </th>
                        <th className="py-3 px-6 bg-black border border-slate-200 font-semibold text-slate-100 text-sm uppercase text-left border-b ">
                            % of Portfolio
                        </th>
                        <th className="py-3 px-6 bg-black border border-slate-200 font-semibold text-slate-100 text-sm uppercase text-left border-b ">
                            Investment Amount
                        </th>
                        <th className="py-3 px-6 bg-black border border-slate-200 font-semibold text-slate-100 text-sm uppercase text-left border-b ">
                            Quantity
                        </th>
                        <th className="py-3 px-6 bg-black border border-slate-200 font-semibold text-slate-100 text-sm uppercase text-left border-b ">
                            Price per Share
                        </th>
                    </tr>
                </thead>
                <tbody className="">
                    {Object.entries(data).map(([ticker, details]) => (
                        <tr key={ticker} className="border-b border-gray-700">
                            <td className="py-4 px-6 border border-slate-200 text-slate-100 font-medium">{ticker}</td>
                            <td className="py-4 px-6 border border-slate-200 text-slate-100">
                                {details["%_of_portfolio"].toFixed(2)}
                            </td>
                            <td className="py-4 px-6 border border-slate-200 text-slate-100">
                                {details.investment_amount.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 border border-slate-200 text-slate-100">
                                {details.quantity ? details.quantity.toFixed(4) : "N/A"}
                            </td>
                            <td className="py-4 px-6 border border-slate-200 text-slate-100">
                                {details.price_per_share ? details.price_per_share.toFixed(2) : "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PortfolioTable;
