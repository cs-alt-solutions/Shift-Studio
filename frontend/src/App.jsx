import React, { useState } from 'react';
import { ConsoleLayout } from './features/workbench/ConsoleLayout';
import { InventoryProvider } from './context/InventoryContext';
import { FinancialProvider } from './context/FinancialContext';
import { BootScreen } from './components/feedback/BootScreen';
import { PinGate } from './components/auth/PinGate'; // New Import
import './styles/global.css';

function App() {
  const [verified, setVerified] = useState(false); // New Security State
  const [booted, setBooted] = useState(false);

  return (
    <InventoryProvider>
      <FinancialProvider>
        {!verified ? (
          <PinGate onVerify={() => setVerified(true)} />
        ) : !booted ? (
          <BootScreen onComplete={() => setBooted(true)} />
        ) : (
          <ConsoleLayout />
        )}
      </FinancialProvider>
    </InventoryProvider>
  );
}
export default App;