$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Push-Location $ProjectRoot
try {
  & "$ProjectRoot\backend\build-windows.ps1"
  npm ci
  npm run desktop:build
  npx electron-builder --win nsis
  Write-Host "安装包已生成：$ProjectRoot\release"
}
finally {
  Pop-Location
}
