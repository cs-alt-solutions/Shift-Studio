/* src/features/workbench/ProfitMatrix.jsx */
import React, { useState } from 'react';
import { useFinancialStats, useFinancial } from '../../context/FinancialContext';
import { useInventory } from '../../context/InventoryContext';
import { StatCard } from '../../components/cards/StatCard';
import { AnimatedNumber } from '../../components/charts/AnimatedNumber';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { TERMINOLOGY } from '../../utils/glossary';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Finance } from '../../components/Icons';
import './ProfitMatrix.css';

export const ProfitMatrix = () => {
  const { totalRev, totalCost, margin, transactions } = useFinancialStats();
  const { addTransaction } = useFinancial();
  const { activeProjects, updateProject } = useInventory();
  
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleData, setSaleData] = useState({ projectId: '', qty: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  const sellableProjects = activeProjects.filter(p => p.stockQty > 0);
  const selectedProject = sellableProjects.find(p => p.id.toString() === saleData.projectId.toString());
  const expectedRevenue = selectedProject ? (selectedProject.retailPrice * saleData.qty) : 0;

  const handleLogSale = async (e) => {
      e.preventDefault();
      if (!selectedProject || saleData.qty < 1) return;
      
      setIsProcessing(true);
      try {
          const txnResult = await addTransaction({
              description: `Sold ${saleData.qty}x ${selectedProject.title}`,
              amount: expectedRevenue,
              type: 'SALE'
          });

          if (!txnResult) {
              alert("Database Error: Transaction rejected.");
              return;
          }

          const newStock = Math.max(0, selectedProject.stockQty - saleData.qty);
          const newSold = (selectedProject.soldQty || 0) + parseInt(saleData.qty);
          
          await updateProject({
              id: selectedProject.id,
              stockQty: newStock,
              soldQty: newSold
          });

          setShowSaleModal(false);
          setSaleData({ projectId: '', qty: 1 });
      } catch (error) {
          console.error("Critical failure logging sale:", error);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="radar-scroll-area relative">
      <div className="inventory-header flex-between mb-20">
        <div>
           <h2 className="header-title">{TERMINOLOGY.FINANCE.HEADER}</h2>
           <span className="header-subtitle">{TERMINOLOGY.FINANCE.SUBTITLE}</span>
        </div>
        <button className="btn-primary flex-center gap-10" onClick={() => setShowSaleModal(true)}>
            <Finance /> LOG SALE
        </button>
      </div>

      <div className="profit-grid-header mb-20">
         <StatCard label={TERMINOLOGY.FINANCE.REVENUE} value={<AnimatedNumber value={totalRev} formatter={formatCurrency} />} glowColor="teal" />
         <StatCard label={TERMINOLOGY.FINANCE.EXPENSE} value={<AnimatedNumber value={totalCost} formatter={formatCurrency} />} glowColor="orange" />
         <StatCard label={TERMINOLOGY.FINANCE.MARGIN_AVG} value={`${margin.toFixed(1)}%`} glowColor="purple" />
      </div>

      <div className="panel-industrial pad-20">
         <RevenueChart />
      </div>

      <div className="panel-industrial mt-20">
         <div className="panel-header"><span className="label-industrial">MASTER LEDGER</span></div>
         <div className="panel-content no-pad">
            <table className="inventory-table">
               <thead>
                  <tr><th>DATE</th><th>DESCRIPTION</th><th className="text-right">AMOUNT</th></tr>
               </thead>
               <tbody>
                  {transactions.map(t => (
                     <tr key={t.id} className="inventory-row">
                        <td className="td-cell text-muted font-small">{formatDate(t.date)}</td>
                        <td className="td-cell font-bold">{t.description}</td>
                        <td className={`td-cell text-right font-bold ${t.amount > 0 ? 'text-good' : 'text-warning'}`}>
                           {formatCurrency(t.amount)}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {showSaleModal && (
        <div className="modal-overlay">
            <div className="modal-window animate-fade-in" style={{ width: '400px', height: 'auto' }}>
                <div className="panel-header flex-between">
                    <span className="font-bold font-large">RECORD SALE</span>
                </div>
                <div className="panel-content pad-20 bg-app">
                    <form onSubmit={handleLogSale}>
                        <div className="lab-form-group mb-20">
                            <label className="label-industrial">SELECT PRODUCT</label>
                            <select className="input-industrial" value={saleData.projectId} onChange={e => setSaleData({...saleData, projectId: e.target.value})} required>
                                <option value="">-- Choose item --</option>
                                {sellableProjects.map(p => <option key={p.id} value={p.id}>{p.title} ({p.stockQty} in stock)</option>)}
                            </select>
                        </div>
                        <div className="lab-form-group mb-20">
                            <label className="label-industrial">QUANTITY SOLD</label>
                            <input type="number" className="input-industrial text-large font-bold text-center" value={saleData.qty} onChange={e => setSaleData({...saleData, qty: e.target.value})} min="1" required />
                        </div>
                        <div className="flex-between bg-row-odd p-15 border-radius-2 border-subtle mb-20">
                            <span className="label-industrial no-margin text-muted">REVENUE</span>
                            <span className="text-good font-bold text-large">{formatCurrency(expectedRevenue)}</span>
                        </div>
                        <div className="flex-between gap-10">
                            <button type="button" className="btn-ghost w-full" onClick={() => setShowSaleModal(false)}>CANCEL</button>
                            <button type="submit" className="btn-primary w-full" disabled={isProcessing || !selectedProject}>CONFIRM SALE</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};