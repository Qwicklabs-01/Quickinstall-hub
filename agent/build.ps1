# Build script to compile the QuickInstall agent into a standalone .exe

$venvPython = Join-Path $PSScriptRoot "..\api\venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    $python = $venvPython
} else {
    $python = "python"
}

$publicKeyPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\api\keys\public.key"))
$distPath = Join-Path $PSScriptRoot "dist"
$workPath = Join-Path $PSScriptRoot "build"
$specPath = $PSScriptRoot

Write-Host "Installing build requirements..."
& $python -m pip install -r "$PSScriptRoot\requirements.txt" -q

Write-Host "Compiling agent with PyInstaller..."
# We use --add-data to embed the Ed25519 public key inside the executable
& $python -m PyInstaller --onefile --clean --distpath "$distPath" --workpath "$workPath" --specpath "$specPath" --add-data "${publicKeyPath};keys" --name QuickInstall "$PSScriptRoot\main.py"

Write-Host "Build complete! Executable is located in agent/dist/QuickInstall.exe"
