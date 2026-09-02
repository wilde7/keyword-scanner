$ErrorActionPreference = "Stop"
$Venv = Join-Path $PSScriptRoot ".packaging-venv"
$Output = Join-Path $PSScriptRoot "dist-win"

Write-Host "[1/3] 创建 Windows 打包环境"
py -3.11 -m venv $Venv
& "$Venv\Scripts\python.exe" -m pip install --upgrade pip
& "$Venv\Scripts\pip.exe" install -r "$PSScriptRoot\requirements.txt" pyinstaller
& "$Venv\Scripts\python.exe" "$PSScriptRoot\prepare_offline_assets.py"

Write-Host "[2/3] 封装本地扫描引擎"
& "$Venv\Scripts\pyinstaller.exe" --noconfirm --clean --onedir --name keyword-scanner-api `
  --distpath $Output --workpath "$PSScriptRoot\build" --specpath "$PSScriptRoot\build" `
  --collect-all docling --collect-all docling_core --collect-all docling_parse --collect-all docling_ibm_models `
  --collect-all rapidocr --collect-all onnxruntime --collect-all pandas --collect-all openpyxl `
  --add-data "$PSScriptRoot\offline-assets;offline-assets" `
  "$PSScriptRoot\desktop_entry.py"

Write-Host "[3/3] 扫描引擎已输出到 $Output\keyword-scanner-api"
