$ErrorActionPreference = "Continue"

$port = 3000
$listener = netstat -ano | Select-String "^\s*TCP\s+\S+:$port\s+\S+\s+LISTENING\s+\d+" | Select-Object -First 1

if ($listener) {
  $existingPid = [int](([regex]"\s+(\d+)$").Match($listener.Line).Groups[1].Value)
  if ($existingPid -gt 0) {
    Write-Host "Stopping existing process on port $port (PID $existingPid)..."
    Stop-Process -Id $existingPid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 600
  }
}

$env:NEXT_DISABLE_SLOW_FILESYSTEM_WARNING = "1"
$env:NEXT_TELEMETRY_DISABLED = "1"

Write-Host "Starting Next.js dev server on port $port..."
npm.cmd run dev:raw -- --port $port
