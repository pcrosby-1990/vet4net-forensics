# Generate Glyph Gallery Manifest
# This script scans the images folders and generates a JSON manifest

$glyphsDir = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\glyphs"
$scrollsDir = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\scrolls"
$sigilsDir = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\images\sigils"
$outputPath = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\data\GlyphGalleryManifest.json"

Write-Host "Scanning sanctuary images..." -ForegroundColor Cyan

$glyphs = @()

# Process glyphs
$glyphFiles = Get-ChildItem -Path $glyphsDir -Filter "*.png"
foreach ($file in $glyphFiles) {
    $name = $file.BaseName -replace '_', ' ' -replace 'Glyph of ', '' -replace 'Glyph ', ''
    $glyphs += @{
        id = "glyph-$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        title = "Glyph of $name"
        imagePath = "/images/glyphs/$($file.Name)"
        source = "codex://glyphs/$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        description = ""
        tags = @("glyph", "visual-sanctuary")
        type = "glyph"
    }
}

# Process scrolls
$scrollFiles = Get-ChildItem -Path $scrollsDir -Filter "*.png"
foreach ($file in $scrollFiles) {
    $name = $file.BaseName -replace '_', ' ' -replace 'Scroll of ', '' -replace 'Scroll ', ''
    $glyphs += @{
        id = "scroll-$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        title = "Scroll of $name"
        imagePath = "/images/scrolls/$($file.Name)"
        source = "codex://scrolls/$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        description = ""
        tags = @("scroll", "visual-sanctuary")
        type = "scroll"
    }
}

# Process sigils
$sigilFiles = Get-ChildItem -Path $sigilsDir -Filter "*.png"
foreach ($file in $sigilFiles) {
    $name = $file.BaseName -replace '_', ' ' -replace 'Sigil of ', '' -replace 'Sigil ', ''
    $glyphs += @{
        id = "sigil-$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        title = "Sigil of $name"
        imagePath = "/images/sigils/$($file.Name)"
        source = "codex://sigils/$($file.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        description = ""
        tags = @("sigil", "visual-sanctuary")
        type = "sigil"
    }
}

# Create manifest
$manifest = @{
    glyphs = $glyphs
    generatedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    totalCount = $glyphs.Count
}

# Write to JSON
$manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding utf8

Write-Host ""
Write-Host "Manifest generated! Total entries: $($glyphs.Count)" -ForegroundColor Green
Write-Host "  Glyphs: $($glyphFiles.Count)" -ForegroundColor Gray
Write-Host "  Scrolls: $($scrollFiles.Count)" -ForegroundColor Gray
Write-Host "  Sigils: $($sigilFiles.Count)" -ForegroundColor Gray
Write-Host ""
Write-Host "Manifest saved to: $outputPath" -ForegroundColor Cyan
