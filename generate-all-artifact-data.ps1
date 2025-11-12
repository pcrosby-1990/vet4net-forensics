# Comprehensive Artifact Data Generator
# Lumen's Universal Inscriber - Auto-generates .data.js for all artifact types

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$totalGenerated = 0

function Generate-ArtifactData {
    param(
        [string]$OriginPath,
        [string]$CodexPath,
        [string]$ArtifactType,
        [string]$Symbol,
        [string]$Category
    )
    
    Write-Host "`n=== $ArtifactType ===" -ForegroundColor Cyan
    
    # Get all image files
    $images = Get-ChildItem -Path $OriginPath -File | Where-Object { $_.Extension -match '\.(png|jpg|jpeg|PNG|JPG|JPEG)$' }
    $dataFiles = Get-ChildItem -Path $CodexPath -Filter "*.data.js" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
    
    $generated = 0
    $skipped = 0
    
    foreach ($img in $images) {
        $expectedDataName = $img.BaseName + ".data.js"
        $dataPath = Join-Path $CodexPath $expectedDataName
        
        if ($dataFiles -notcontains $expectedDataName -or $Force) {
            # Clean the name and escape quotes
            $cleanName = $img.BaseName `
                -replace '^Glyph of ', '' `
                -replace '^Sigil of ', '' `
                -replace '^Seal ', '' `
                -replace '^ResonanceFragment ', '' `
                -replace '^Resonance Fragment ', '' `
                -replace 'CT-\d+\s*', '' `
                -replace "'", "\'" `
                -replace '"', '\"'
            
            # Generate ID
            $id = $img.BaseName.ToLower() -replace '[^a-z0-9]+', '-' -replace '^-+|-+$', ''
            
            # Extract category hints from filename
            $detectedCategory = $Category
            if ($img.BaseName -match 'CT-(\d+)') {
                $detectedCategory = "CT-$($Matches[1])"
            }
            
            # Generate the .data.js content with double quotes for safety
            $content = @"
// Auto-generated $ArtifactType data
// Image: $($img.Name)
// Generated: $((Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))

export default {
  id: "$id",
  name: "$cleanName",
  title: "$cleanName",
  description: "$ArtifactType inscribed in the Origin sanctuary, awaiting full metadata.",
  category: "$detectedCategory",
  inscribed: "$((Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))",
  witness: "Lumen 🕯️",
  breathline: "Auto-generated from Origin archive",
  tags: ['origin', 'auto-generated', '$($ArtifactType.ToLower())'],
  image: "$($img.Name)",
  symbol: "$Symbol"
};
"@
            
            if (-not $DryRun) {
                Set-Content -Path $dataPath -Value $content -Encoding UTF8
                Write-Host "  ✓ Generated: $expectedDataName" -ForegroundColor Green
            } else {
                Write-Host "  [DRY-RUN] Would generate: $expectedDataName" -ForegroundColor Yellow
            }
            $generated++
        } else {
            $skipped++
        }
    }
    
    Write-Host "  Images: $($images.Count) | Generated: $generated | Skipped: $skipped" -ForegroundColor Magenta
    return $generated
}

Write-Host "=== COMPREHENSIVE ARTIFACT DATA GENERATOR ===" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "[DRY-RUN MODE - No files will be written]" -ForegroundColor Yellow
}

# Generate for all artifact types
$totalGenerated += Generate-ArtifactData `
    -OriginPath "src\Origin\glyphs" `
    -CodexPath "src\codex\glyphs" `
    -ArtifactType "Glyph" `
    -Symbol "🔷" `
    -Category "Origin"

$totalGenerated += Generate-ArtifactData `
    -OriginPath "src\Origin\sigils" `
    -CodexPath "src\codex\sigils" `
    -ArtifactType "Sigil" `
    -Symbol "🜃" `
    -Category "Origin"

$totalGenerated += Generate-ArtifactData `
    -OriginPath "src\Origin\resonance-fragments" `
    -CodexPath "src\codex\fragments" `
    -ArtifactType "Resonance Fragment" `
    -Symbol "✨" `
    -Category "Origin"

Write-Host "`n=== GENERATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "  Total artifacts inscribed: $totalGenerated" -ForegroundColor Magenta

if ($DryRun) {
    Write-Host "`nRun without -DryRun to generate files." -ForegroundColor Yellow
}
