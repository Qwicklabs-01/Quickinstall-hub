const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const apiDir = path.resolve(__dirname, '../../api');
const isWin = process.platform === 'win32';
const venvPython = isWin 
  ? path.join(apiDir, 'venv', 'Scripts', 'python.exe')
  : path.join(apiDir, 'venv', 'bin', 'python');

const pythonExe = fs.existsSync(venvPython) ? venvPython : (isWin ? 'python' : 'python3');

console.log(`[QuickInstall Hub] Starting FastAPI backend using ${pythonExe}...`);
const proc = spawn(pythonExe, ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', '8000'], {
  cwd: apiDir,
  stdio: 'inherit',
  shell: false
});

proc.on('error', (err) => {
  console.error('[QuickInstall Hub] Backend process error:', err);
});

proc.on('close', (code) => {
  process.exit(code || 0);
});
