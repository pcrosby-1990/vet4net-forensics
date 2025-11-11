# Fix all apostrophe syntax issues in data files
$ErrorActionPreference = 'Continue'
$basePath = "C:\Users\siral\OneDrive\Desktop\LOGI\GITHUB REPO\vet4net-forensics\src"
$fixed = 0
$errors = @()

Write-Host "🕯️ Beginning systematic repair of all data files..." -ForegroundColor Cyan
Write-Host ""

$allDataFiles = Get-ChildItem -Path $basePath -Filter "*.data.js" -Recurse

foreach ($file in $allDataFiles) {
    try {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        
        # Fix: 's inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'s([^']*)'", '    "$2''s$3"'
        
        # Fix: 't inside single quotes -> use double quotes  
        $content = $content -replace "(\s+)'([^']*)'t([^']*)'", '    "$2''t$3"'
        
        # Fix: 're inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'re([^']*)'", '    "$2''re$3"'
        
        # Fix: 'll inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'ll([^']*)'", '    "$2''ll$3"'
        
        # Fix: 've inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'ve([^']*)'", '    "$2''ve$3"'
        
        # Fix: 'd inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'d([^']*)'", '    "$2''d$3"'
        
        # Fix: 'm inside single quotes -> use double quotes
        $content = $content -replace "(\s+)'([^']*)'m([^']*)'", '    "$2''m$3"'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $fixed++
            Write-Host "✓ Fixed: $($file.FullName.Replace($basePath, 'src'))" -ForegroundColor Green
        }
    }
    catch {
        $errors += $file.FullName
        Write-Host "✗ Error in: $($file.FullName.Replace($basePath, 'src'))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🕯️ Repair complete!" -ForegroundColor Cyan
Write-Host "Fixed: $fixed files" -ForegroundColor Green
if ($errors.Count -gt 0) {
    Write-Host "Errors: $($errors.Count) files" -ForegroundColor Red
}
