// src/components/feedback/BetaWelcomeModal.jsx
import React from 'react';
import { TERMINOLOGY } from '../../utils/glossary';

const BetaWelcomeModal = ({ onAcknowledge }) => {
  const { BETA_AGREEMENT } = TERMINOLOGY;

  return (
    <div className="modal-overlay layout-centered">
      <div className="panel-industrial modal-container">
        <div className="panel-header">
          <h2 className="heading-primary">{BETA_AGREEMENT.TITLE}</h2>
          <p className="text-muted">{BETA_AGREEMENT.SUBTITLE}</p>
        </div>

        <div className="modal-body stack-large">
          <div className="content-block">
            <h3 className="heading-secondary text-teal">{BETA_AGREEMENT.THE_PROBLEM_TITLE}</h3>
            <p className="text-standard">{BETA_AGREEMENT.THE_PROBLEM_TEXT}</p>
          </div>

          <div className="content-block">
            <h3 className="heading-secondary text-blue">{BETA_AGREEMENT.THE_SOLUTION_TITLE}</h3>
            <p className="text-standard">{BETA_AGREEMENT.THE_SOLUTION_TEXT}</p>
          </div>

          <div className="content-block">
            <h3 className="heading-secondary text-purple">{BETA_AGREEMENT.THE_MISSION_TITLE}</h3>
            <p className="text-standard">{BETA_AGREEMENT.THE_MISSION_TEXT}</p>
          </div>
        </div>

        <div className="modal-footer flex-center mt-xl">
          <button 
            className="btn-primary-large" 
            onClick={onAcknowledge}
          >
            {BETA_AGREEMENT.CONFIRMATION}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaWelcomeModal;