import React, { useEffect, useState } from 'react';
import axios from 'axios';


export interface HistoricalDataEntry {
  date: string;
  close: number;
}

export interface StockPrice {
  name: string;
  symbol: string;
  historicalData: HistoricalDataEntry[];
}

const StockCharts: React.FC = () => {
  const [niftyData, setNiftyData] = useState<StockPrice | null>(null);


  useEffect(() => {
    axios.get('/nifty50.json')
      .then((response) => {
        setNiftyData(response.data);
      })
      .catch((err) => {
        console.error('Error fetching JSON data:', err);
      });
  }, []);




  return <>
    {niftyData?.name}
  </>;
}

export default StockCharts;
