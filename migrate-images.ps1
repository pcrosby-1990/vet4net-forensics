# Image Migration Helper Script
# Run this from the repository root to organize your downloaded glyph images

$downloadsPath = "$env:USERPROFILE\Downloads"
$targetBase = "public\images"

Write-Host "✧ Visual Sanctuary Image Migration ✧" -ForegroundColor Cyan
Write-Host ""

# Function to show available images
function Show-AvailableImages {
    Write-Host "Available PNG images in Downloads:" -ForegroundColor Yellow
    $images = Get-ChildItem $downloadsPath -Filter "*.png" | 
              Sort-Object LastWriteTime -Descending |
              Select-Object -First 20
    
    for ($i = 0; $i -lt $images.Count; $i++) {
        Write-Host "[$i] $($images[$i].Name)" -ForegroundColor White
        Write-Host "    Modified: $($images[$i].LastWriteTime)" -ForegroundColor Gray
    }
    
    return $images
}

# Function to copy image with new name
function Copy-ImageToGallery {
    param(
        [string]$sourcePath,
        [string]$category,  # 'glyphs', 'sigils', or 'scrolls'
        [string]$newName
    )
    
    $targetDir = Join-Path $targetBase $category
    $targetPath = Join-Path $targetDir "$newName.png"
    
    Copy-Item $sourcePath $targetPath -Force
    Write-Host "✓ Copied to: $targetPath" -ForegroundColor Green
}

# Main menu
$images = Show-AvailableImages

Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  [number] - Select image to migrate"
Write-Host "  'list' - Show available images again"
Write-Host "  'quit' - Exit"
Write-Host ""

while ($true) {
    $input = Read-Host "Enter command"
    
    if ($input -eq 'quit') { break }
    if ($input -eq 'list') { 
        $images = Show-AvailableImages
        continue 
    }
    
    # Try to parse as number
    try {
        $index = [int]$input
        if ($index -lt 0 -or $index -ge $images.Count) {
            Write-Host "Invalid index. Please try again." -ForegroundColor Red
            continue
        }
        
        $selectedImage = $images[$index]
        Write-Host ""
        Write-Host "Selected: $($selectedImage.Name)" -ForegroundColor Yellow
        Write-Host ""
        
        # Ask for category
        Write-Host "Select category:" -ForegroundColor Cyan
        Write-Host "  [1] Glyphs"
        Write-Host "  [2] Sigils"  
        Write-Host "  [3] Scrolls"
        $catChoice = Read-Host "Category"
        
        $category = switch ($catChoice) {
            '1' { 'glyphs' }
            '2' { 'sigils' }
            '3' { 'scrolls' }
            default { 
                Write-Host "Invalid category." -ForegroundColor Red
                continue 
            }
        }
        
        # Ask for name
        $newName = Read-Host "Enter new name (without .png)"
        if ([string]::IsNullOrWhiteSpace($newName)) {
            Write-Host "Invalid name." -ForegroundColor Red
            continue
        }
        
        # Copy the file
        Copy-ImageToGallery -sourcePath $selectedImage.FullName -category $category -newName $newName
        
        Write-Host ""
        Write-Host "Don't forget to add this to GlyphGalleryManifest.json:" -ForegroundColor Yellow
        Write-Host @"
{
  "id": "$category-$newName",
  "title": "Your Title Here",
  "imagePath": "/images/$category/$newName.png",
  "source": "codex://your/source/path",
  "description": "Your description here",
  "tags": ["tag1", "tag2"]
}
"@ -ForegroundColor Gray
        Write-Host ""
        
    } catch {
        Write-Host "Invalid input. Please try again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✧ Migration complete. The Visual Sanctuary awaits. ✧" -ForegroundColor Cyan
