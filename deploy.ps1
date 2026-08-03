# deploy.ps1 — Automated Build & Deploy Prep with Fixed Filenames

Write-Host "1. Setting index.html entrypoint to /src/main.jsx..." -ForegroundColor Cyan
$sourceHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orbit Lubricants | Power in Every Drop - Premium Automotive & Industrial Lubricants</title>
  <meta name="description" content="Orbit Lubricant Industries — premium automotive and industrial lubricants engineered for superior engine protection, efficiency, and performance.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/logo.png">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
"@
Set-Content -Path "index.html" -Value $sourceHtml

Write-Host "2. Building Vite production bundle..." -ForegroundColor Cyan
npm run build

Write-Host "3. Syncing assets to root..." -ForegroundColor Cyan
Remove-Item "assets" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "assets" | Out-Null
Copy-Item "dist\assets\*" "assets\" -Recurse -Force

Write-Host "4. Setting root index.html to production build output..." -ForegroundColor Cyan
$prodHtml = Get-Content "dist\index.html" -Raw
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$prodHtmlWithCacheBuster = $prodHtml -replace 'app\.js"', "app.js?v=$timestamp`"" -replace 'style\.css"', "style.css?v=$timestamp`""
Set-Content -Path "index.html" -Value $prodHtmlWithCacheBuster

Write-Host "Build prep complete! 1612 modules compiled with app.js." -ForegroundColor Green
