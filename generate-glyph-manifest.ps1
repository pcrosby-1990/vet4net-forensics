# Generate Glyph Manifest for Visual Sanctuary
# This script catalogs all glyphs from the public/glyphs directory

$glyphsPath = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\public\glyphs"
$outputPath = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\src\data\GlyphManifest.json"

$glyphs = Get-ChildItem -Path $glyphsPath -Filter "*.png" | ForEach-Object {
    $name = $_.BaseName -replace '_', ' ' -replace '-', ' '
    
    @{
        id = "glyph-$($_.BaseName.ToLower() -replace '[^a-z0-9]', '-')"
        title = $name
        imagePath = "/glyphs/$($_.Name)"
        timestamp = $_.LastWriteTime.ToString("yyyy-MM-ddTHH:mm:ssZ")
        fileName = $_.Name
        fileSize = $_.Length
    }
}

$manifest = @{
    generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    totalGlyphs = $glyphs.Count
    glyphs = $glyphs
} | ConvertTo-Json -Depth 5

# Ensure data directory exists
New-Item -ItemType Directory -Force -Path "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\src\data" | Out-Null

# Write manifest
$manifest | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "✧ Glyph Manifest generated: $($glyphs.Count) glyphs inscribed"
Write-Host "   Output: $outputPath"
