# Aggressive apostrophe fix - handles all cases
$basePath = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\src"
$fixed = 0

Write-Host "🕯️ Aggressive apostrophe repair..." -ForegroundColor Cyan

Get-ChildItem -Path $basePath -Filter "*.data.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $originalContent = $content
    $lines = $content -split "`n"
    $newLines = @()
    
    foreach ($line in $lines) {
        # If line contains single-quoted string with apostrophe, convert to double quotes
        if ($line -match "^(\s+)'([^']+)'(s|t|re|ll|ve|d|m)([^']+)'(.*)$") {
            # Extract parts
            if ($line -match "^(\s+)'(.+)'$") {
                $indent = $matches[1]
                $stringContent = $matches[2]
                
                # Only fix if it contains problematic apostrophes
                if ($stringContent -match "'(s|t|re|ll|ve|d|m)\b") {
                    $line = $indent + '"' + $stringContent + '"'
                }
            }
        }
        $newLines += $line
    }
    
    $content = $newLines -join "`n"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $_.FullName -Value $content -NoNewline
        $fixed++
        Write-Host "✓ $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "`n🕯️ Fixed $fixed files" -ForegroundColor Cyan
