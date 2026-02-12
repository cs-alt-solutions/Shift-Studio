import React from 'react';
import { TERMINOLOGY } from '../../../utils/glossary';

export const StatusBadge = ({ status, customLabel }) => {
  const config = {
    active: { class: 'text-good', label: TERMINOLOGY.STATUS.ACTIVE },
    low: { class: 'text-warning', label: TERMINOLOGY.STATUS.LOW },
    alert: { class: 'text-alert', label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    draft: { class: 'text-accent', label: TERMINOLOGY.STATUS.DRAFT },
    completed: { class: 'text-purple', label: TERMINOLOGY.STATUS.COMPLETED }
  };
  const { class: statusClass, label: defaultLabel } = config[status.toLowerCase()] || {};
  return (
    <span className={`status-badge-industrial ${statusClass} font-mono font-bold font-small`}>
      {customLabel || defaultLabel || status.toUpperCase()}
    </span>
  );
};
