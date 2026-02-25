/* src/components/charts/RevenueChart.jsx */
import React, { useMemo } from 'react';
import './RevenueChart.css';
import { useFinancialStats } from '../../context/FinancialContext';
import { formatCurrency } from '../../utils/formatters';

export const RevenueChart = () => {
  const { transactions, monthlyBurn } = useFinancialStats();

  const { chartData, yAxisLabels, maxVal } = useMemo(() => {
    // 1. Generate the timeline for the last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateObj: d,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: 0,
        expenses: 0
      });
    }

    // 2. Map actual transactions to the timeline
    transactions.forEach(tx => {
      const txDate = new Date(tx.created_at || tx.date);
      const dayMatch = days.find(d => 
        d.dateObj.getDate() === txDate.getDate() && 
        d.dateObj.getMonth() === txDate.getMonth() &&
        d.dateObj.getFullYear() === txDate.getFullYear()
      );

      if (dayMatch) {
        if (tx.type === 'SALE' || tx.type === 'INCOME') {
          dayMatch.sales += Math.abs(tx.amount || 0);
        } else if (tx.type === 'EXPENSE') {
          dayMatch.expenses += Math.abs(tx.amount || 0);
        }
      }
    });

    // 3. Determine the dynamic ceiling for the Y-Axis
    let highestValue = Math.max(monthlyBurn, 10); // Floor of 10
    days.forEach(d => {
      if (d.sales > highestValue) highestValue = d.sales;
      if (d.expenses > highestValue) highestValue = d.expenses;
    });

    // Add a 10% breathing room to the top of the chart
    const ceiling = highestValue * 1.1;

    // 4. Generate precise Y-Axis Labels
    const yLabels = [ceiling, ceiling * 0.75, ceiling * 0.5, ceiling * 0.25, 0];

    // 5. Calculate bar heights as a percentage of the ceiling
    const finalData = days.map(d => ({
      ...d,
      salesHeight: Math.max((d.sales / ceiling) * 100, 1), // 1% min to show a sliver if 0
      expensesHeight: Math.max((d.expenses / ceiling) * 100, 1)
    }));

    return { chartData: finalData, yAxisLabels: yLabels, maxVal: ceiling };
  }, [transactions, monthlyBurn]);

  // Calculate where the Burn Rate threshold line should sit
  const burnHeightPercent = Math.min((monthlyBurn / maxVal) * 100, 100);

  return (
    <div className="finance-chart-wrapper">
      {/* Legend Area */}
      <div className="chart-legend flex-end gap-20 mb-15">
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-dot bg-neon-teal"></span> SALES
         </div>
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-dot bg-neon-orange"></span> EXPENSES
         </div>
         <div className="flex-center gap-10 font-small font-mono text-muted">
            <span className="legend-line bg-neon-red"></span> BURN RATE
         </div>
      </div>

      <div className="finance-chart-core">
        {/* Y-Axis Metrics */}
        <div className="finance-y-axis">
          {yAxisLabels.map((val, i) => (
            <div key={i} className="y-axis-tick font-mono font-small text-muted">
              {formatCurrency(val)}
            </div>
          ))}
        </div>

        {/* Plot Area */}
        <div className="finance-plot-area">
          {/* Structural Grid Lines */}
          <div className="finance-grid-lines">
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line"></div>
            <div className="finance-grid-line base"></div>
          </div>

          {/* Burn Rate Threshold Line */}
          {monthlyBurn > 0 && (
              <div 
                 className="burn-rate-line" 
                 style={{ bottom: `${burnHeightPercent}%` }}
                 title={`Monthly Burn Rate: ${formatCurrency(monthlyBurn)}`}
              />
          )}

          {/* Data Bars */}
          <div className="finance-bar-container">
             {chartData.map((day, idx) => (
                <div key={idx} className="finance-bar-group">
                   <div className="finance-bars">
                      <div 
                         className="finance-bar bar-sales" 
                         style={{ height: `${day.salesHeight}%` }}
                         title={`${day.label} Sales: ${formatCurrency(day.sales)}`}
                      ></div>
                      <div 
                         className="finance-bar bar-expenses" 
                         style={{ height: `${day.expensesHeight}%` }}
                         title={`${day.label} Expenses: ${formatCurrency(day.expenses)}`}
                      ></div>
                   </div>
                   <div className="finance-x-label font-mono font-small text-muted">{day.label}</div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};