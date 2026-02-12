# 1. ENSURE DIRECTORIES EXIST
New-Item -ItemType Directory -Path "src/components/cards", "src/components/charts", "src/components/ui", "src/components/feedback" -Force | Out-Null

# 2. FORCE MOVE COMPONENTS
Write-Host "Moving files to new architecture..."
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

# 3. INTERNAL PATH RECALIBRATION
# Fix components that moved down a level and now need an extra ../ to reach utils
Write-Host "Updating internal component imports..."
$targetDirs = "src/components/cards", "src/components/charts", "src/components/ui", "src/components/feedback"
foreach ($dir in $targetDirs) {
    if (Test-Path $dir) {
        Get-ChildItem -Path $dir -Filter *.jsx | ForEach-Object {
            (Get-Content $_.FullName) -replace "from '\.\./", "from '../../" | Set-Content $_.FullName
        }
    }
}

# 4. COMPREHENSIVE FEATURE UPDATE
# Fix every file in the workbench to ensure they point to the correct subfolders
Write-Host "Updating Workbench features..."
$featureFiles = Get-ChildItem -Path "src/features/workbench" -Filter *.jsx -Recurse
foreach ($file in $featureFiles) {
    (Get-Content $file.FullName) `
    -replace "components/StatCard", "components/cards/StatCard" `
    -replace "components/ProjectCard", "components/cards/ProjectCard" `
    -replace "components/AssetCard", "components/cards/AssetCard" `
    -replace "components/VaultFolder", "components/cards/VaultFolder" `
    -replace "components/RevenueChart", "components/charts/RevenueChart" `
    -replace "components/Dial", "components/charts/Dial" `
    -replace "components/AnimatedNumber", "components/charts/AnimatedNumber" `
    -replace "components/BootScreen", "components/feedback/BootScreen" `
    -replace "components/InputGroup", "components/ui/InputGroup" `
    -replace "components/StampHeader", "components/ui/StampHeader" `
    -replace "components/ImagePlaceholder", "components/ui/ImagePlaceholder" `
    | Set-Content $file.FullName
}

Write-Host "Architecture Sync Complete."