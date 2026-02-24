/* src/features/workbench/components/TransactionHistory.jsx */
import React, { useState, useMemo } from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';
import { formatDate } from '../../../utils/formatters'; // <-- NEW: Centralized formatter
import './TransactionHistory.css';

export const TransactionHistory = ({ transactions, onEdit, onDelete }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // The Filter Engine
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchTerm]);

  return (
    <div className="transaction-history-container">
      <div className="history-header flex-between mb-15">
        <h3 className="label-industrial no-margin">{TERMINOLOGY.FINANCE.LEDGER_HEADER}</h3>
        
        <div className="history-controls flex-center gap-10">
          <input 
            type="text" 
            className="input-industrial" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px' }}
          />
          <select 
            className="input-industrial" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">ALL TYPES</option>
            <option value="INCOME">INCOME / SALE</option>
            <option value="EXPENSE">EXPENSE</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>{TERMINOLOGY.FINANCE.DATE}</th>
              <th>{TERMINOLOGY.FINANCE.DESC}</th>
              <th>TYPE</th>
              <th className="text-right">{TERMINOLOGY.FINANCE.AMOUNT}</th>
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="inventory-row">
                  <td className="td-cell text-muted font-small">
                      {formatDate(tx.created_at || tx.date)} {/* <-- FIXED: Pure function */}
                  </td>
                  <td className="td-cell font-bold">{tx.description}</td>
                  <td className="td-cell">
                    <span className={`status-badge-industrial font-mono font-small ${tx.type === 'INCOME' || tx.type === 'SALE' ? 'text-good' : 'text-warning'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`td-cell text-right font-bold ${tx.type === 'EXPENSE' ? 'text-warning' : 'text-good'}`}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="td-cell text-center">
                    <div className="flex-center gap-10">
                      <button className="btn-ghost" onClick={() => onEdit(tx)}>EDIT</button>
                      <button className="btn-ghost" style={{ color: 'var(--neon-red)', borderColor: 'var(--border-subtle)' }} onClick={() => onDelete(tx.id)}>DEL</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="inventory-row">
                <td colSpan="5" className="td-cell text-center text-muted italic">
                  {TERMINOLOGY.FINANCE.EMPTY_LEDGER}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};