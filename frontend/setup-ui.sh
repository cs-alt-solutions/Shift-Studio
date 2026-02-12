# 1. CREATE DIRECTORY ARCHITECTURE
Write-Host "🚀 Initializing Atomic Component Architecture..." -ForegroundColor Cyan
$folders = "src/components/cards", "src/components/charts", "src/components/ui", "src/components/feedback"
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) { New-Item -ItemType Directory -Path $folder -Force }
}

# 2. MIGRATE EXISTING ASSETS
Write-Host "📦 Migrating existing components to new sectors..." -ForegroundColor Yellow
Move-Item -Path "src/components/StatCard.jsx" -Destination "src/components/cards/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/ProjectCard.*" -Destination "src/components/cards/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/AssetCard.*" -Destination "src/components/cards/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/VaultFolder.*" -Destination "src/components/cards/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/RevenueChart.*" -Destination "src/components/charts/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/Dial.*" -Destination "src/components/charts/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/AnimatedNumber.jsx" -Destination "src/components/charts/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/BootScreen.*" -Destination "src/components/feedback/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/InputGroup.jsx" -Destination "src/components/ui/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/StampHeader.*" -Destination "src/components/ui/" -ErrorAction SilentlyContinue
Move-Item -Path "src/components/ImagePlaceholder.*" -Destination "src/components/ui/" -ErrorAction SilentlyContinue

# 3. UPDATE IMPORTS (Path Correction)
Write-Host "🔧 Recalibrating import paths..." -ForegroundColor Gray
$targetDirs = "src/components/cards", "src/components/charts", "src/components/ui", "src/components/feedback"
foreach ($dir in $targetDirs) {
    Get-ChildItem -Path $dir -Filter *.jsx | ForEach-Object {
        (Get-Content $_.FullName) -replace "from '\.\./", "from '../../" | Set-Content $_.FullName
    }
}

# Update Feature Consumers
$filesToFix = "src/features/workbench/DashboardHome.jsx", "src/features/workbench/InventoryManager.jsx", "src/features/workbench/Workshop.jsx"
foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        (Get-Content $file) `
        -replace "components/StatCard", "components/cards/StatCard" `
        -replace "components/ProjectCard", "components/cards/ProjectCard" `
        -replace "components/AssetCard", "components/cards/AssetCard" `
        -replace "components/VaultFolder", "components/cards/VaultFolder" `
        | Set-Content $file
    }
}

# 4. INJECT NEW ATOMIC COMPONENTS
Write-Host "🛠️ Fabricating new atomic UI components..." -ForegroundColor Cyan

# StatusBadge
@'
import React from 'react';
import { TERMINOLOGY } from '../../utils/glossary';

export const StatusBadge = ({ status, customLabel }) => {
  const config = {
    active: { class: 'text-good', label: TERMINOLOGY.STATUS.ACTIVE },
    low: { class: 'text-warning', label: TERMINOLOGY.STATUS.LOW },
    alert: { class: 'text-alert', label: TERMINOLOGY.STATUS.OUT_OF_STOCK },
    draft: { class: 'text-accent', label: TERMINOLOGY.STATUS.DRAFT },
    completed: { class: 'text-purple', label: TERMINOLOGY.STATUS.COMPLETED }
  };
  const { class: statusClass, label: defaultLabel } = config[status.toLowerCase()] || {};
  return (
    <span className={`status-badge-industrial ${statusClass} font-mono font-bold font-small`}>
      {customLabel || defaultLabel || status.toUpperCase()}
    </span>
  );
};
'@ | Set-Content "src/components/ui/StatusBadge.jsx"

# ProgressBar
@'
import React from 'react';
import './ProgressBar.css';
export const ProgressBar = ({ value, max = 100, colorVar = '--neon-purple' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-track-universal">
      <div className="progress-fill-universal" style={{ width: `${percentage}%`, backgroundColor: `var(${colorVar})`, boxShadow: `0 0 10px var(${colorVar})` }} />
    </div>
  );
};
'@ | Set-Content "src/components/ui/ProgressBar.jsx"

".progress-track-universal { width: 100%; height: 4px; background: var(--bg-row-even); border-radius: 2px; overflow: hidden; }
.progress-fill-universal { height: 100%; transition: width 0.6s cubic-bezier(0.25, 1, 0.5, 1); }" | Set-Content "src/components/ui/ProgressBar.css"

# DataField
@'
import React from 'react';
export const DataField = ({ label, value, accent = false, mono = false }) => (
  <div className="data-field-container mb-10">
    <span className="label-industrial no-margin">{label}</span>
    <div className={`data-field-value ${accent ? 'text-accent' : ''} ${mono ? 'font-mono' : ''}`}>
      {value}
    </div>
  </div>
);
'@ | Set-Content "src/components/ui/DataField.jsx"

# IndustrialButton
@'
import React from 'react';
export const IndustrialButton = ({ label, icon: Icon, variant = 'primary', onClick, width = 'auto', disabled = false }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  return (
    <button className={`${className} flex-center gap-10`} style={{ width }} onClick={onClick} disabled={disabled}>
      {Icon && <Icon />} {label}
    </button>
  );
};
'@ | Set-Content "src/components/ui/IndustrialButton.jsx"

Write-Host "✅ System Reorganization Complete. SHIFT STUDIO v2.0 Architecture is now Locked." -ForegroundColor Green