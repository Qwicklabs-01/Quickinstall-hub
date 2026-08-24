# This script starts both the FastAPI backend and Next.js frontend with a single command.
Write-Host "Starting QuickInstall Hub Servers..." -ForegroundColor Cyan

# 1. Start the FastAPI Backend in a new background window
Write-Host "Starting FastAPI Backend (Port 8000)..." -ForegroundColor Yellow
$apiCommand = "cd '$PSScriptRoot\api'; if (-Not (Test-Path 'venv')) { Write-Host 'Creating Python virtual environment...'; python -m venv venv }; Write-Host 'Installing Python dependencies...'; .\venv\Scripts\python.exe -m pip install -r requirements.txt -q; Write-Host 'Starting Uvicorn server...'; .\venv\Scripts\python.exe -m uvicorn app.main:app --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $apiCommand -WindowStyle Normal

# 2. Start the Next.js Frontend in a new background window
Write-Host "Starting Next.js Frontend (Port 3000)..." -ForegroundColor Green
$webCommand = "cd '$PSScriptRoot\web'; Write-Host 'Installing Node dependencies...'; npm install; Write-Host 'Starting Next.js dev server...'; npm run dev:next"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $webCommand -WindowStyle Normal

Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:3000"
Write-Host "Backend API docs will be at: http://localhost:8000/docs"
