import { Chart } from "react-google-charts";
import React, { useEffect, useState } from "react";
import { Portfolio } from '../pages/Dashboard';
import { useAuth } from "@/context/AuthContext";
import axios from "axios";


const Pie_Chart: React.FC = () => {
    const { currentUser } = useAuth();
    const [portfolioData, setPortfolioData] = useState<Portfolio | undefined>(undefined);

    const getUserPortfolio = async () => {
        try {
            const email = currentUser?.email || '';
            const idToken = await currentUser?.getIdToken();
            const res = await axios.get(`https://sylva-django.onrender.com/api/users/`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });
            if (res.data.success) {
                const portfolio: Portfolio = { initial_portfolio: res.data.user.initial_portfolio, target_portfolio: res.data.user.target_portfolio, actions: res.data.user.actions }
                setPortfolioData(portfolio);
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.email) {
            const fetchToken = async () => {
                const tokenId = await currentUser.getIdToken();
                console.log("ID Token:", tokenId);
            };

            fetchToken();

            getUserPortfolio();
        }
    }, [currentUser]);



    if (!portfolioData) return null;
    const portfolioArray = Object.keys(portfolioData.initial_portfolio).map(ticker => {
        const stock = portfolioData.initial_portfolio[ticker];
        const percentage = stock["%_of_portfolio"];
        return [ticker, percentage];
    });

    const data = [["Stocks", "Percentage"], ...portfolioArray];

    const options = {
        title: "Portfolio holdings",
        backgroundColor: "transparent"
    };

    return (
        <Chart
            className="cursor-pointer"
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"100%"}
        />
    );
}

export default Pie_Chart