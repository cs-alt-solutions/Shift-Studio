import React, { useState, useMemo } from 'react';
import { UI_TEXT } from '../../../utils/glossary';
import './TransactionHistory.css';

export const TransactionHistory = ({ transactions, onEdit, onDelete }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // The Visionary's Filter Engine
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchTerm]);

  return (
    <div className="transaction-history-container panel-base">
      <div className="history-header">
        <h3 className="text-heading">{UI_TEXT.financial.historyTitle}</h3>
        
        <div className="history-controls">
          <input 
            type="text" 
            className="input-base" 
            placeholder={UI_TEXT.actions.search} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="select-base" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">{UI_TEXT.filters.all}</option>
            <option value="INCOME">{UI_TEXT.financial.income}</option>
            <option value="EXPENSE">{UI_TEXT.financial.expense}</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>{UI_TEXT.financial.date}</th>
              <th>{UI_TEXT.financial.description}</th>
              <th>{UI_TEXT.financial.type}</th>
              <th className="text-right">{UI_TEXT.financial.amount}</th>
              <th className="text-center">{UI_TEXT.actions.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td>{tx.description}</td>
                  <td>
                    <span className={`badge-${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="text-right">${tx.amount.toFixed(2)}</td>
                  <td className="text-center action-cells">
                    <button className="btn-icon" onClick={() => onEdit(tx)}>
                      {UI_TEXT.actions.edit}
                    </button>
                    <button className="btn-icon danger" onClick={() => onDelete(tx.id)}>
                      {UI_TEXT.actions.delete}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  {UI_TEXT.financial.noTransactions}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};