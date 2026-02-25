/* src/components/cards/VendorCard.jsx */
import React from 'react';
import './AssetCard.css';
import { TERMINOLOGY } from '../../utils/glossary';
// 1. Import the new utilities
import { getDomainFromUrl, getFaviconUrl } from '../../utils/formatters';

export const VendorCard = ({ vendor, onClick, isSelected }) => {
  const { name, website, leadTime, reliability } = vendor;
  
  let statusClass = 'status-good';
  if (reliability < 50) statusClass = 'status-alert';
  else if (reliability < 80) statusClass = 'status-warning';

  // 2. Get domain and icon
  const cleanDomain = getDomainFromUrl(website);
  const favicon = getFaviconUrl(website, 32); // size 32 for the card

  return (
    <div 
        className={`asset-card ${isSelected ? 'selected' : ''} ${statusClass}`}
        onClick={onClick}
    >
      <div className="asset-header">
         {/* 3. Display the icon next to the name if available */}
         <div className="flex items-center gap-10">
            {website && <img src={favicon} alt={name} style={{ width: 20, height: 20, borderRadius: 2 }} />}
            <span className="label-industrial font-medium">{name}</span>
         </div>
      </div>
      
      <div className="mt-10 mb-10">
         {website ? (
             // 4. Display cleaner link text
            <a 
                href={website.startsWith('http') ? website : `https://${website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent font-small font-mono clickable flex items-center gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                 {cleanDomain} ↗
            </a>
         ) : (
            <span className="text-muted font-small font-mono">NO WEBSITE LINKED</span>
         )}
      </div>
      
      <div className="asset-metrics">
         <div className="metric-col">
            <span className="label-industrial">{TERMINOLOGY.VENDOR.LEAD_TIME}</span>
            <div className="metric-value text-main">
                {leadTime ? `${leadTime} DAYS` : 'UNKNOWN'}
            </div>
         </div>
         <div className="metric-col text-right">
            <span className="label-industrial">{TERMINOLOGY.VENDOR.RELIABILITY}</span>
            <div className={`metric-value ${statusClass === 'status-good' ? 'text-good' : statusClass === 'status-warning' ? 'text-warning' : 'text-alert'}`}>
                {reliability ? `${reliability}/100` : 'N/A'}
            </div>
         </div>
      </div>
    </div>
  );
};