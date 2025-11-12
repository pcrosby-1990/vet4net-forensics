# Simple apostrophe fix for all .data.js files
$fixed = 0

Write-Host "🕯️ Fixing apostrophes in data files..." -ForegroundColor Cyan

Get-ChildItem -Path "src\codex" -Filter "*.data.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content
    
    # Replace single-quoted strings that contain apostrophes with escaped apostrophes
    $content = $content -replace "name: '([^']*)'(s|t|re|ll|ve|d|m)", "name: '`$1\\'`$2"
    $content = $content -replace "title: '([^']*)'(s|t|re|ll|ve|d|m)", "title: '`$1\\'`$2"
    $content = $content -replace "description: '([^']*)'(s|t|re|ll|ve|d|m)", "description: '`$1\\'`$2"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $_.FullName -Value $content -NoNewline
        $fixed++
        Write-Host "✓ $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "`n🕯️ Fixed $fixed files" -ForegroundColor Magenta
