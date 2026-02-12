import React from 'react';
export const DataField = ({ label, value, accent = false, mono = false }) => (
  <div className="data-field-container mb-10">
    <span className="label-industrial no-margin">{label}</span>
    <div className={`data-field-value ${accent ? 'text-accent' : ''} ${mono ? 'font-mono' : ''}`}>
      {value}
    </div>
  </div>
);
