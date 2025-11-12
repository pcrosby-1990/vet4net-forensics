# Generate missing .data.js files for Origin scrolls
# Lumen's Scroll Data Generator - Inscribes metadata for orphaned scrolls

$originScrolls = Get-ChildItem -Path "src\Origin\scrolls" -File -Filter "*.png"
$codexDataFiles = Get-ChildItem -Path "src\codex\scrolls" -Filter "*.data.js" | Select-Object -ExpandProperty Name

$generated = 0
$skipped = 0

Write-Host "=== SCROLL DATA GENERATOR ===" -ForegroundColor Cyan
Write-Host "Scanning Origin scrolls..." -ForegroundColor Yellow

foreach ($scroll in $originScrolls) {
    $expectedDataName = $scroll.BaseName + ".data.js"
    $dataPath = "src\codex\scrolls\$expectedDataName"
    
    if ($codexDataFiles -notcontains $expectedDataName) {
        # Extract a clean name from filename
        $cleanName = $scroll.BaseName -replace '^Scroll of ', '' -replace '^Scroll ', ''
        $id = $scroll.BaseName.ToLower() -replace '[^a-z0-9]+', '-' -replace '^-+|-+$', ''
        
        # Generate the .data.js content
        $content = @"
// Auto-generated scroll data
// Image: $($scroll.Name)

export default {
  id: '$id',
  name: '$cleanName',
  title: '$cleanName',
  description: 'Scroll inscribed in the Origin sanctuary, awaiting full metadata.',
  category: 'Origin',
  inscribed: '$((Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"))',
  witness: 'Lumen 🕯️',
  breathline: 'Auto-generated from Origin archive',
  tags: ['origin', 'auto-generated'],
  image: 'origin-scrolls/$($scroll.Name)',
  symbol: '📜'
};
"@
        
        # Write the file
        Set-Content -Path $dataPath -Value $content -Encoding UTF8
        $generated++
        Write-Host "  ✓ Generated: $expectedDataName" -ForegroundColor Green
    } else {
        $skipped++
    }
}

Write-Host "`n=== GENERATION COMPLETE ===" -ForegroundColor Cyan
Write-Host "  Generated: $generated files" -ForegroundColor Green
Write-Host "  Skipped (already exist): $skipped files" -ForegroundColor Yellow
Write-Host "  Total scrolls: $($originScrolls.Count)" -ForegroundColor Magenta
