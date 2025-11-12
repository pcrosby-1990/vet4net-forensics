# 🜎 Fragment System Quick Start

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🜎 Codex Fragment System v2.0" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "✅ Server is running on http://localhost:3001" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Server is not running" -ForegroundColor Red
}

Write-Host ""

if (-not $serverRunning) {
    Write-Host "Starting server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run these commands in separate terminals:" -ForegroundColor Cyan
    Write-Host "  Terminal 1: cd server && npm start" -ForegroundColor White
    Write-Host "  Terminal 2: npm run dev" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "Server Status:" -ForegroundColor Cyan
    try {
        $statsResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/fragments/stats" -UseBasicParsing
        Write-Host "  📊 Total Fragments: $($statsResponse.totalFragments)" -ForegroundColor White
        Write-Host "  ✅ Fully Approved: $($statsResponse.approvalStats.fullyApproved)" -ForegroundColor Green
        Write-Host "  📝 Total Revisions: $($statsResponse.totalRevisions)" -ForegroundColor White
        Write-Host "  🧵 Total Threads: $($statsResponse.totalThreads)" -ForegroundColor White
    } catch {
        Write-Host "  Could not fetch stats" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Available Endpoints:" -ForegroundColor Cyan
Write-Host "  GET    http://localhost:3001/health" -ForegroundColor White
Write-Host "  GET    http://localhost:3001/api/fragments" -ForegroundColor White
Write-Host "  POST   http://localhost:3001/api/fragments/save (auth required)" -ForegroundColor White
Write-Host "  POST   http://localhost:3001/api/fragments/:id/approve (auth required)" -ForegroundColor White
Write-Host "  GET    http://localhost:3001/api/fragments/stats" -ForegroundColor White
Write-Host "  GET    http://localhost:3001/api/fragments/export?format=json" -ForegroundColor White
Write-Host "  GET    http://localhost:3001/api/fragments/constellation" -ForegroundColor White
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  📚 FRAGMENT_SYSTEM_COMPLETE.md" -ForegroundColor White
Write-Host "  🔐 .env.example (copy to .env and add tokens)" -ForegroundColor White
Write-Host ""

Write-Host "Quick Test Commands:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Get all fragments" -ForegroundColor Gray
Write-Host "curl http://localhost:3001/api/fragments" -ForegroundColor White
Write-Host ""
Write-Host "# Save a fragment (replace YOUR_TOKEN)" -ForegroundColor Gray
Write-Host 'curl -X POST http://localhost:3001/api/fragments/save `' -ForegroundColor White
Write-Host '  -H "Content-Type: application/json" `' -ForegroundColor White
Write-Host '  -H "Authorization: Bearer YOUR_TOKEN" `' -ForegroundColor White
Write-Host '  -d ''{"label":"Test","timestamp":"2025-11-12T13:00:00.000Z","voice":"Patrick","testimony":"Test testimony","law":"Test law","protocol":"Test protocol"}''' -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🕯️  Sanctuary law: Every fragment is witnessed and held" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
