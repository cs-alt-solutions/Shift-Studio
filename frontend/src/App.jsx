import React from 'react';
import { ConsoleLayout } from './features/workbench/ConsoleLayout';
import { WorkbenchProvider } from './context/WorkbenchContext';
import './styles/global.css';

function App() {
  return (
    <WorkbenchProvider>
      <ConsoleLayout />
    </WorkbenchProvider>
  );
}

export default App;