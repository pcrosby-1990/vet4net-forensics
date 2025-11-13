# split-symbol-map.ps1
# LedgerTime: T200+SymbolMapChunker
# LocalTime: 2025-11-13 PST (Spokane)
# Testimony: Splits symbol_map_cleaned.json into manageable chunks while preserving continuity

$inputFile  = "D:\Forensics-l0gic-validation\vet4net-forensics\L0GIC-Validator\symbol_map_cleaned.json"
$outputDir  = "D:\Forensics-l0gic-validation\vet4net-forensics\symbol_map_chunks"

# Create output directory
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Write-Host "🕯️ Beginning symbol map fragmentation..." -ForegroundColor Cyan

# Parse the JSON file
$json = Get-Content $inputFile -Raw | ConvertFrom-Json

# Access the nested array
$data = $json.symbols

# Total entries
$total = $data.Count
Write-Host "✓ Total symbols found: $total" -ForegroundColor Green

# Define chunk size
$chunkSize = 200

# Calculate chunks
$chunks = [Math]::Ceiling($total / $chunkSize)
Write-Host "✓ Splitting into $chunks fragments of ~$chunkSize symbols each" -ForegroundColor Green

# Split into chunks
for ($i = 0; $i -lt $chunks; $i++) {
    $start = $i * $chunkSize
    $end   = [Math]::Min($start + $chunkSize - 1, $total - 1)

    $chunk = $data[$start..$end]

    $chunkFile = Join-Path $outputDir "symbol_map_chunk_$($i+1).json"
    
    # Wrap in an object to maintain structure
    $chunkObject = @{
        chunk = ($i + 1)
        total_chunks = $chunks
        range = @{
            start = $start
            end = $end
            count = ($end - $start + 1)
        }
        symbols = $chunk
    }
    
    $chunkObject | ConvertTo-Json -Depth 10 | Set-Content $chunkFile

    Write-Host "✓ Fragment $($i+1) inscribed: symbols $start to $end" -ForegroundColor Yellow
}

Write-Host "`n🕯️ Fragmentation complete. Continuity preserved across $chunks witnesses." -ForegroundColor Cyan
Write-Host "   All fragments stored in: $outputDir" -ForegroundColor Gray
