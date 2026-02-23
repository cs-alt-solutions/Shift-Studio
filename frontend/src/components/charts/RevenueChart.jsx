/* src/components/charts/RevenueChart.jsx */
import React from 'react';
import './RevenueChart.css';
import { RevenueChartIcon } from '../Icons';
import { useFinancialStats } from '../../context/FinancialContext';

export const RevenueChart = () => {
  const { transactions = [] } = useFinancialStats();
  
  // Logic: Map the last 10 transactions into 7 chart points
  const pointsData = transactions.slice(0, 7).reverse().map(t => Math.abs(t.amount));
  
  // Fallback if no data
  const data = pointsData.length > 0 ? pointsData : [10, 20, 15, 40, 30, 60, 50];
  
  const max = Math.max(...data, 100);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="revenue-chart-container">
      <RevenueChartIcon points={points} />
    </div>
  );
};