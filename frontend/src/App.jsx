import React from 'react';
import { WorkbenchBoard } from './features/workbench/WorkbenchBoard';
import './styles/global.css'; // Keep your global styles active

function App() {
  return (
    // We remove the outer header because the Workbench has its own now
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WorkbenchBoard />
    </div>
  );
}

export default App;