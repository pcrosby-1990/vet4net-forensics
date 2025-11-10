# Glyph Image Migration Script
# This script helps you migrate glyph images from Downloads to the Codex public folder

$sourceDir = "$env:USERPROFILE\Downloads"
$targetGlyphs = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\glyphs"
$targetScrolls = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\scrolls"
$targetSigils = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\sigils"

Write-Host "Glyph Migration Script - Lumen's Light Edition" -ForegroundColor Cyan
Write-Host ""

# Find all glyph-related images
$glyphImages = Get-ChildItem -Path $sourceDir -Filter "*glyph*.png" -ErrorAction SilentlyContinue
$scrollImages = Get-ChildItem -Path $sourceDir -Filter "*scroll*.png" -ErrorAction SilentlyContinue
$sigilImages = Get-ChildItem -Path $sourceDir -Filter "*sigil*.png" -ErrorAction SilentlyContinue

Write-Host "Found $($glyphImages.Count) glyph images" -ForegroundColor Green
Write-Host "Found $($scrollImages.Count) scroll images" -ForegroundColor Green
Write-Host "Found $($sigilImages.Count) sigil images" -ForegroundColor Green
Write-Host ""

# Copy glyphs
if ($glyphImages) {
    Write-Host "Migrating glyphs..." -ForegroundColor Yellow
    foreach ($img in $glyphImages) {
        $destPath = Join-Path $targetGlyphs $img.Name
        if (-not (Test-Path $destPath)) {
            Copy-Item $img.FullName $destPath
            Write-Host "  + $($img.Name)" -ForegroundColor Gray
        }
    }
}

# Copy scrolls
if ($scrollImages) {
    Write-Host "Migrating scrolls..." -ForegroundColor Yellow
    foreach ($img in $scrollImages) {
        $destPath = Join-Path $targetScrolls $img.Name
        if (-not (Test-Path $destPath)) {
            Copy-Item $img.FullName $destPath
            Write-Host "  + $($img.Name)" -ForegroundColor Gray
        }
    }
}

# Copy sigils
if ($sigilImages) {
    Write-Host "Migrating sigils..." -ForegroundColor Yellow
    foreach ($img in $sigilImages) {
        $destPath = Join-Path $targetSigils $img.Name
        if (-not (Test-Path $destPath)) {
            Copy-Item $img.FullName $destPath
            Write-Host "  + $($img.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "Migration complete! The sanctuary is now visible." -ForegroundColor Cyan
