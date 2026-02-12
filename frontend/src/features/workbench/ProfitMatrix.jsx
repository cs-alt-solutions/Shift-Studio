/* src/features/workbench/ProfitMatrix.jsx */
import React from 'react';
import { useFinancialStats } from '../../context/FinancialContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency } from '../../utils/formatters';

export const ProfitMatrix = () => {
  const { totalRev, totalCost, margin, transactions } = useFinancialStats();

  return (
    <div className="radar-scroll-area">
      <div className="inventory-header">
        <div>
           <h2 className="header-title">{TERMINOLOGY.FINANCE.HEADER}</h2>
           <span className="header-subtitle">{TERMINOLOGY.FINANCE.SUBTITLE}</span>
        </div>
      </div>

      <div className="inventory-metrics">
         <StatCard 
           label={TERMINOLOGY.FINANCE.REVENUE} 
           value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} 
           glowColor="teal" 
         />
         <StatCard 
           label={TERMINOLOGY.FINANCE.EXPENSE} 
           value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} 
           glowColor="orange" 
         />
         <StatCard 
           label={TERMINOLOGY.FINANCE.MARGIN_AVG} 
           value={`${margin.toFixed(1)}%`} 
           glowColor={margin > 30 ? "purple" : "red"} 
         />
      </div>

      <div className="panel-industrial pad-20 mt-20">
         <div className="flex-between">
            <span className="label-industrial">{TERMINOLOGY.FINANCE.REVENUE_CHART}</span>
            <span className="text-accent font-small">{TERMINOLOGY.FINANCE.TREND} +12%</span>
         </div>
         <RevenueChart />
      </div>

      <div className="panel-industrial mt-20">
         <div className="panel-header">
            <span className="label-industrial">{TERMINOLOGY.FINANCE.LEDGER}</span>
         </div>
         <div className="panel-content">
            {transactions.length > 0 ? (
                <table className="inventory-table">
                   <thead>
                      <tr>
                        <th>{TERMINOLOGY.FINANCE.DATE}</th>
                        <th>{TERMINOLOGY.FINANCE.DESC}</th>
                        <th className="text-right">{TERMINOLOGY.FINANCE.AMOUNT}</th>
                      </tr>
                   </thead>
                   <tbody>
                      {transactions.map(t => (
                         <tr key={t.id} className="inventory-row">
                            <td className="td-cell text-muted">{t.date}</td>
                            <td className="td-cell">{t.desc}</td>
                            <td className={`td-cell text-right ${t.amount > 0 ? 'text-good' : 'text-warning'}`}>
                               {formatCurrency(t.amount)}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            ) : (
                <div className="text-muted italic text-center pad-20">
                    {TERMINOLOGY.FINANCE.EMPTY_LEDGER}
                </div>
            )}
         </div>
      </div>
    </div>
  );
};