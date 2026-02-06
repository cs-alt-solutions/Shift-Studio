import React, { useState } from 'react';
import './ProjectCard.css'; // Importing the specific styles

export const ProjectCard = ({ project }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Calculator State
  const [calc, setCalc] = useState({ price: '', bought: '', unit: 'lbs', used: '' });
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.stopPropagation(); // Stop the click from flipping the card back
    
    // Call Python Brain
    try {
      const response = await fetch('http://127.0.0.1:8000/api/calculate-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_price: parseFloat(calc.price),
          purchase_amount: parseFloat(calc.bought),
          purchase_unit: calc.unit,
          recipe_amount: parseFloat(calc.used),
          recipe_unit: calc.unit 
        })
      });
      const data = await response.json();
      setResult(data.cost);
    } catch (err) {
      console.error("Calculator Error:", err);
      setResult("Error");
    }
  };

  const handleDragStart = (e) => {
    // Attach data for the drop
    e.dataTransfer.setData('cardId', project.id);
    e.dataTransfer.effectAllowed = "move";
  };

  // Determine status color class based on profit/data presence
  const statusClass = project.profit ? 'status-green' : 'status-grey';

  return (
    <div 
      className={`project-card-wrapper ${isFlipped ? 'flipped' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`project-card ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* --- FRONT OF CARD --- */}
        <div className={`card-face front ${statusClass}`}>
          <div>
            <h3 className="card-title">{project.name}</h3>
            
            <div className="card-stats">
              <span title="Demand">🔥 {project.demand || '-'}</span>
              <span title="Competition">⚖️ {project.competition || '-'}</span>
              <span className="profit-tag">
                {project.profit ? `$${project.profit}` : '-'}
              </span>
            </div>
          </div>
          
          <div className="click-hint">
             Click to flip
          </div>
        </div>

        {/* --- BACK OF CARD (CALCULATOR) --- */}
        <div className="card-face back">
          <h4 style={{margin:'0 0 15px 0', color:'#555', textTransform:'uppercase', fontSize:'0.8rem'}}>
            🧪 Material Lab
          </h4>
          
          <div className="calc-input-group">
            <input 
              className="calc-input"
              placeholder="$ Cost" 
              type="number"
              onClick={e => e.stopPropagation()} 
              onChange={e => setCalc({...calc, price: e.target.value})}
            />
          </div>
          
          <div className="calc-input-group">
            <input 
              className="calc-input"
              placeholder="Qty Bought" 
              type="number"
              onClick={e => e.stopPropagation()} 
              onChange={e => setCalc({...calc, bought: e.target.value})}
            />
            <select 
              className="calc-input" 
              style={{width:'80px'}}
              onClick={e => e.stopPropagation()}
              onChange={e => setCalc({...calc, unit: e.target.value})}
            >
              <option value="lbs">lbs</option>
              <option value="oz">oz</option>
              <option value="g">g</option>
            </select>
          </div>

          <div className="calc-input-group">
            <input 
              className="calc-input"
              placeholder="Qty Used in Recipe" 
              type="number"
              onClick={e => e.stopPropagation()} 
              onChange={e => setCalc({...calc, used: e.target.value})}
            />
          </div>

          <button className="calc-btn" onClick={handleCalculate}>
            RUN CALCULATION
          </button>

          {result !== null && (
            <div className="result-display">
              Cost: ${result}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};