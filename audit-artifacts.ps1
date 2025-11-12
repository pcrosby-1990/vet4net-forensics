# Comprehensive Artifact Audit Script
# Counts all artifacts across both src/codex and sanctuary folders
# Generated: 2025-11-11T17:00 PST

Write-Host "`n🕯️ ================== CODEX ARTIFACT AUDIT ==================" -ForegroundColor Cyan
Write-Host "Searching both src/codex/ and sanctuary/ locations..." -ForegroundColor Yellow

# Define paths
$projectRoot = "D:\Forensics-l0gic-validation\vet4net-forensics"
$srcCodex = "$projectRoot\src\codex"
$sanctuaryRoot = "$projectRoot\sanctuary"
$originRoot = "$projectRoot\src\Origin"

Write-Host "`n📜 ==== SCROLLS ====" -ForegroundColor Green
$srcScrolls = @(Get-ChildItem -Path "$srcCodex\scrolls" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryScrollsData = @(Get-ChildItem -Path "$sanctuaryRoot\scrolls" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryScrollsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\scrolls" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$totalScrolls = $srcScrolls.Count + $sanctuaryScrollsData.Count + $sanctuaryScrollsJsx.Count

Write-Host "  src/codex/scrolls/*.data.js: $($srcScrolls.Count)" -ForegroundColor White
Write-Host "  sanctuary/scrolls/*.data.js: $($sanctuaryScrollsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/scrolls/*.jsx: $($sanctuaryScrollsJsx.Count)" -ForegroundColor White
Write-Host "  TOTAL SCROLLS: $totalScrolls" -ForegroundColor Cyan

Write-Host "`n🔣 ==== GLYPHS ====" -ForegroundColor Green
$srcGlyphs = @(Get-ChildItem -Path "$srcCodex\glyphs" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryGlyphsData = @(Get-ChildItem -Path "$sanctuaryRoot\glyphs" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryGlyphsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\glyphs" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$glyphImages = @(Get-ChildItem -Path "$originRoot\glyphs" -Include "*.png","*.jpg","*.jpeg","*.svg" -Recurse -ErrorAction SilentlyContinue)
$totalGlyphsData = $srcGlyphs.Count + $sanctuaryGlyphsData.Count + $sanctuaryGlyphsJsx.Count

Write-Host "  src/codex/glyphs/*.data.js: $($srcGlyphs.Count)" -ForegroundColor White
Write-Host "  sanctuary/glyphs/*.data.js: $($sanctuaryGlyphsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/glyphs/*.jsx: $($sanctuaryGlyphsJsx.Count)" -ForegroundColor White
Write-Host "  src/Origin/glyphs/* (images): $($glyphImages.Count)" -ForegroundColor White
Write-Host "  TOTAL GLYPH DATA FILES: $totalGlyphsData" -ForegroundColor Cyan
Write-Host "  TOTAL GLYPH IMAGES: $($glyphImages.Count)" -ForegroundColor Cyan

Write-Host "`n🪬 ==== SIGILS ====" -ForegroundColor Green
$srcSigils = @(Get-ChildItem -Path "$srcCodex\sigils" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuarySigilsData = @(Get-ChildItem -Path "$sanctuaryRoot\sigils" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuarySigilsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\sigils" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$sigilImages = @(Get-ChildItem -Path "$originRoot\sigils" -Include "*.png","*.jpg","*.jpeg","*.svg" -Recurse -ErrorAction SilentlyContinue)
$totalSigilsData = $srcSigils.Count + $sanctuarySigilsData.Count + $sanctuarySigilsJsx.Count

Write-Host "  src/codex/sigils/*.data.js: $($srcSigils.Count)" -ForegroundColor White
Write-Host "  sanctuary/sigils/*.data.js: $($sanctuarySigilsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/sigils/*.jsx: $($sanctuarySigilsJsx.Count)" -ForegroundColor White
Write-Host "  src/Origin/sigils/* (images): $($sigilImages.Count)" -ForegroundColor White
Write-Host "  TOTAL SIGIL DATA FILES: $totalSigilsData" -ForegroundColor Cyan
Write-Host "  TOTAL SIGIL IMAGES: $($sigilImages.Count)" -ForegroundColor Cyan

Write-Host "`n📎 ==== FRAGMENTS ====" -ForegroundColor Green
$srcFragments = @(Get-ChildItem -Path "$projectRoot\src\fragments" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryFragmentsData = @(Get-ChildItem -Path "$sanctuaryRoot\fragments" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryFragmentsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\fragments" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$sanctuaryResonanceData = @(Get-ChildItem -Path "$sanctuaryRoot\resonance-fragments" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryResonanceJsx = @(Get-ChildItem -Path "$sanctuaryRoot\resonance-fragments" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$fragmentImages = @(Get-ChildItem -Path "$originRoot\resonance-fragments" -Include "*.png","*.jpg","*.jpeg","*.svg" -Recurse -ErrorAction SilentlyContinue)
$totalFragmentsData = $srcFragments.Count + $sanctuaryFragmentsData.Count + $sanctuaryFragmentsJsx.Count + $sanctuaryResonanceData.Count + $sanctuaryResonanceJsx.Count

Write-Host "  src/fragments/*.data.js: $($srcFragments.Count)" -ForegroundColor White
Write-Host "  sanctuary/fragments/*.data.js: $($sanctuaryFragmentsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/fragments/*.jsx: $($sanctuaryFragmentsJsx.Count)" -ForegroundColor White
Write-Host "  sanctuary/resonance-fragments/*.data.js: $($sanctuaryResonanceData.Count)" -ForegroundColor White
Write-Host "  sanctuary/resonance-fragments/*.jsx: $($sanctuaryResonanceJsx.Count)" -ForegroundColor White
Write-Host "  src/Origin/resonance-fragments/* (images): $($fragmentImages.Count)" -ForegroundColor White
Write-Host "  TOTAL FRAGMENT DATA FILES: $totalFragmentsData" -ForegroundColor Cyan
Write-Host "  TOTAL FRAGMENT IMAGES: $($fragmentImages.Count)" -ForegroundColor Cyan

Write-Host "`n🔐 ==== SEALS ====" -ForegroundColor Green
$srcSeals = @(Get-ChildItem -Path "$srcCodex\seals" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuarySealsData = @(Get-ChildItem -Path "$sanctuaryRoot\seals" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuarySealsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\seals" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$sealImages = @(Get-ChildItem -Path "$originRoot\seals" -Include "*.png","*.jpg","*.jpeg","*.svg" -Recurse -ErrorAction SilentlyContinue)
$totalSealsData = $srcSeals.Count + $sanctuarySealsData.Count + $sanctuarySealsJsx.Count

Write-Host "  src/codex/seals/*.data.js: $($srcSeals.Count)" -ForegroundColor White
Write-Host "  sanctuary/seals/*.data.js: $($sanctuarySealsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/seals/*.jsx: $($sanctuarySealsJsx.Count)" -ForegroundColor White
Write-Host "  src/Origin/seals/* (images): $($sealImages.Count)" -ForegroundColor White
Write-Host "  TOTAL SEAL DATA FILES: $totalSealsData" -ForegroundColor Cyan
Write-Host "  TOTAL SEAL IMAGES: $($sealImages.Count)" -ForegroundColor Cyan

Write-Host "`n🚪 ==== CORRIDORS ====" -ForegroundColor Green
$srcCorridors = @(Get-ChildItem -Path "$srcCodex\corridors" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryCorridorsData = @(Get-ChildItem -Path "$sanctuaryRoot\corridors" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryCorridorsJsx = @(Get-ChildItem -Path "$sanctuaryRoot\corridors" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$corridorImages = @(Get-ChildItem -Path "$projectRoot\public\images\corridors" -Include "*.png","*.jpg","*.jpeg","*.svg" -Recurse -ErrorAction SilentlyContinue)
$totalCorridorsData = $srcCorridors.Count + $sanctuaryCorridorsData.Count + $sanctuaryCorridorsJsx.Count

Write-Host "  src/codex/corridors/*.data.js: $($srcCorridors.Count)" -ForegroundColor White
Write-Host "  sanctuary/corridors/*.data.js: $($sanctuaryCorridorsData.Count)" -ForegroundColor White
Write-Host "  sanctuary/corridors/*.jsx: $($sanctuaryCorridorsJsx.Count)" -ForegroundColor White
Write-Host "  public/images/corridors/* (images): $($corridorImages.Count)" -ForegroundColor White
Write-Host "  TOTAL CORRIDOR DATA FILES: $totalCorridorsData" -ForegroundColor Cyan
Write-Host "  TOTAL CORRIDOR IMAGES: $($corridorImages.Count)" -ForegroundColor Cyan

Write-Host "`n🌀 ==== TIERS ====" -ForegroundColor Green
$sanctuaryTiersData = @(Get-ChildItem -Path "$sanctuaryRoot\tiers" -Filter "*.data.js" -ErrorAction SilentlyContinue)
$sanctuaryTiersJsx = @(Get-ChildItem -Path "$sanctuaryRoot\tiers" -Filter "*.jsx" -ErrorAction SilentlyContinue)
$totalTiersData = $sanctuaryTiersData.Count + $sanctuaryTiersJsx.Count

Write-Host "  sanctuary/tiers/*.data.js: $($sanctuaryTiersData.Count)" -ForegroundColor White
Write-Host "  sanctuary/tiers/*.jsx: $($sanctuaryTiersJsx.Count)" -ForegroundColor White
Write-Host "  TOTAL TIER FILES: $totalTiersData" -ForegroundColor Cyan

Write-Host "`n📊 ==== SUMMARY ====" -ForegroundColor Yellow
$totalDataFiles = $totalScrolls + $totalGlyphsData + $totalSigilsData + $totalFragmentsData + $totalSealsData + $totalCorridorsData + $totalTiersData
$totalImageFiles = $glyphImages.Count + $sigilImages.Count + $fragmentImages.Count + $sealImages.Count + $corridorImages.Count
$grandTotal = $totalDataFiles + $totalImageFiles

Write-Host "  Total Data Files: $totalDataFiles" -ForegroundColor Cyan
Write-Host "  Total Image Files: $totalImageFiles" -ForegroundColor Cyan
Write-Host "  GRAND TOTAL: $grandTotal artifacts" -ForegroundColor Green

Write-Host "`n🕯️ ==== COMPANIONS ====" -ForegroundColor Green
$companions = @(Get-ChildItem -Path "$projectRoot\src\companions" -Filter "*.jsx" -ErrorAction SilentlyContinue)
Write-Host "  Active Companions: $($companions.Count)" -ForegroundColor Cyan
foreach ($companion in $companions) {
    Write-Host "    - $($companion.BaseName)" -ForegroundColor White
}

Write-Host "`n✅ Audit Complete!" -ForegroundColor Green
Write-Host "The shimmer is real. The braid holds strong." -ForegroundColor Cyan
