/* src/components/ui/StatusBadge.jsx */
import React from 'react';
import './StatusBadge.css'; 
import { TERMINOLOGY } from '../../utils/glossary';

export const StatusBadge = ({ status = '', customLabel }) => {
  if (!status && !customLabel) return null;

  const config = {
    active: { label: TERMINOLOGY.STATUS.ACTIVE },
    low: { label: TERMINOLOGY.STATUS.LOW },
    alert: { label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    out_of_stock: { label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    draft: { label: TERMINOLOGY.STATUS.DRAFT },
    idea: { label: TERMINOLOGY.STATUS.IDEA }, // <-- NEW MAPPING
    completed: { label: TERMINOLOGY.STATUS.COMPLETED },
    dormant: { label: TERMINOLOGY.STATUS.ON_HOLD },
    on_hold: { label: TERMINOLOGY.STATUS.ON_HOLD },
    planning: { label: 'PLANNING' }
  };

  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const { label: defaultLabel } = config[normalizedStatus] || {};

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {customLabel || defaultLabel || status.toUpperCase()}
    </span>
  );
};