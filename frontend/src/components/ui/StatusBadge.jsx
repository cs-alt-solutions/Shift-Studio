/* src/components/ui/StatusBadge.jsx */
import React from 'react';
import { TERMINOLOGY } from '../../utils/glossary';

export const StatusBadge = ({ status = '', customLabel }) => {
  if (!status && !customLabel) return null;

  const config = {
    active: { class: 'text-good', label: TERMINOLOGY.STATUS.ACTIVE },
    low: { class: 'text-warning', label: TERMINOLOGY.STATUS.LOW },
    alert: { class: 'text-alert', label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    out_of_stock: { class: 'text-alert', label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    draft: { class: 'text-accent', label: TERMINOLOGY.STATUS.DRAFT },
    completed: { class: 'text-purple', label: TERMINOLOGY.STATUS.COMPLETED },
    dormant: { class: 'text-dim', label: TERMINOLOGY.STATUS.ON_HOLD },
    on_hold: { class: 'text-dim', label: TERMINOLOGY.STATUS.ON_HOLD }
  };

  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const { class: statusClass, label: defaultLabel } = config[normalizedStatus] || {};

  return (
    <span className={`status-badge-industrial ${statusClass || 'text-muted'} font-mono font-bold font-small`}>
      {customLabel || defaultLabel || status.toUpperCase()}
    </span>
  );
};