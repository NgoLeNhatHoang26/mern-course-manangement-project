param(
  [string]$BaseUrl = "https://course-management-api-yozg.onrender.com",
  [string]$Email = "",
  [string]$Password = ""
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
  Write-Error "k6 chưa được cài. Cài bằng: winget install k6.k6"
}

$env:BASE_URL = $BaseUrl
if ($Email) { $env:EMAIL = $Email }
if ($Password) { $env:PASSWORD = $Password }

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$resultsDir = Join-Path $PSScriptRoot "results"
New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null

Write-Host "==> [1/2] Smoke test"
k6 run (Join-Path $PSScriptRoot "smoke.js") `
  | Tee-Object -FilePath (Join-Path $resultsDir "smoke-$timestamp.txt")

Write-Host ""
Write-Host "==> [2/2] Load suite (critical paths)"
k6 run (Join-Path $PSScriptRoot "load-suite.js") `
  | Tee-Object -FilePath (Join-Path $resultsDir "load-suite-$timestamp.txt")

Write-Host ""
Write-Host "Kết quả đã lưu tại: $resultsDir"
Write-Host "Copy số liệu vào docs/LOAD-TEST.md (mục Kết quả thực tế)."
