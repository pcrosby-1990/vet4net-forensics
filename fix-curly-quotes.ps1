# Fix all curly apostrophes in JSX files
$rootPath = "D:\Forensics-l0gic-validation\vet4net-forensics"
$files = Get-ChildItem -Path $rootPath -Filter "*.jsx" -Recurse | Where-Object { $_.FullName -notmatch "node_modules" }

$fixedCount = 0
$totalFixed = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Replace curly apostrophe with straight apostrophe
        $content = $content.Replace([char]0x2019, "'")
        
        # Replace curly quotes with straight quotes
        $content = $content.Replace([char]0x201C, '"')
        $content = $content.Replace([char]0x201D, '"')
        
        if ($content -ne $originalContent) {
            $content | Set-Content -Path $file.FullName -Encoding UTF8 -NoNewline
            Write-Host "✓ Fixed: $($file.FullName)" -ForegroundColor Green
            $fixedCount++
            
            # Count how many apostrophes were fixed
            $matches = ([regex]::Matches($originalContent, [char]0x2019)).Count
            $totalFixed += $matches
        }
    }
    catch {
        Write-Host "✗ Error fixing $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "`n✓ Fixed $fixedCount files ($totalFixed apostrophes)" -ForegroundColor Cyan
