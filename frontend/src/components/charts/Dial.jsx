/* src/components/charts/Dial.jsx */
import React from 'react';
import './Dial.css';
import { DialIcon } from '../Icons';

export const Dial = ({ value, label, colorVar }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="dial-wrapper">
      <div className="dial-svg-container">
        {/* PROTOCOL 2: SVG moved to Icons.jsx */}
        <DialIcon 
            radius={radius} 
            circumference={circumference} 
            offset={offset} 
            colorVar={colorVar} 
        />
        <div className="dial-value-text">{value}%</div>
      </div>
      <span className="label-industrial no-margin">{label}</span>
    </div>
  );
};