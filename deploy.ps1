# deploy.ps1 — Build and prepare files for Hostinger GitHub auto-deploy
# Run this script before every git push: .\deploy.ps1

Write-Host "Building Vite production bundle..." -ForegroundColor Cyan
npm run build

Write-Host "Copying dist/index.html to root..." -ForegroundColor Cyan
Copy-Item "dist\index.html" "index.html" -Force
Copy-Item "dist\logo.png" "logo.png" -Force -ErrorAction SilentlyContinue

Write-Host "Syncing assets/ folder..." -ForegroundColor Cyan
Remove-Item "assets" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "assets" | Out-Null
Copy-Item "dist\assets\*" "assets\" -Recurse -Force

Write-Host "All files ready for deployment!" -ForegroundColor Green
Write-Host "Now run: git add -A && git commit -m 'update' && git push origin main" -ForegroundColor Yellow
