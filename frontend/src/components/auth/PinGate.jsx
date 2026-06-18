import React, { useState } from 'react';
import { TERMINOLOGY } from '../../utils/glossary';
import './PinGate.css';

export const PinGate = ({ onVerify }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate against env secret
    if (pin === import.meta.env.VITE_ACCESS_PIN) {
      onVerify();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="gate-overlay">
      <div className="panel-industrial gate-window p-30">
        <h2 className="text-neon-teal text-center mb-20">{TERMINOLOGY.AUTH.TITLE}</h2>
        <form onSubmit={handleSubmit} className="flex-col gap-15">
          <input
            type="password"
            className={`input-industrial ${error ? 'border-alert' : ''}`}
            placeholder={TERMINOLOGY.AUTH.PROMPT}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary w-full">
            {TERMINOLOGY.AUTH.SUBMIT}
          </button>
        </form>
      </div>
    </div>
  );
};