/* src/packages/beta-engine/tabs/ManifestoTab.jsx */
import React from 'react';
import { GLITCHBOT_DICT } from '../dictionary';

export const ManifestoTab = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="manifesto-title">{GLITCHBOT_DICT.HUB.MANIFESTO.HEADING}</h1>
      <div className="manifesto-body">
        <p>{GLITCHBOT_DICT.HUB.MANIFESTO.BODY_1}</p>
        <p>{GLITCHBOT_DICT.HUB.MANIFESTO.BODY_2}</p>
      </div>
      <div className="manifesto-signature">
        {GLITCHBOT_DICT.HUB.MANIFESTO.SIGNATURE}
      </div>
    </div>
  );
};