import { spawn } from 'child_process';

const args = process.argv.slice(2);
console.log('Original start args:', args);

const filteredArgs = [];
for (let i = 0; i < args.length; i++) {
  filteredArgs.push(args[i]);
}

// Add default port and host if they're not already present
if (!filteredArgs.includes('--port') && !filteredArgs.some(a => a.startsWith('--port=')) && !filteredArgs.includes('-p')) {
  filteredArgs.push('--port', '3000');
}
if (!filteredArgs.includes('--host') && !filteredArgs.includes('-H')) {
  filteredArgs.push('--host', '0.0.0.0');
}

console.log('Filtered start args:', filteredArgs);

// Background spawn FastAPI main.py using python3
console.log('Spawning FastAPI Python backend (uvicorn main:app)...');
const pythonProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8080'], {
  stdio: 'inherit',
  shell: true
});

pythonProcess.on('error', (err) => {
  console.error('Failed to start python backend:', err);
});

const child = spawn('npx', ['vite', 'preview', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  try {
    pythonProcess.kill();
  } catch (e) {}
  process.exit(code || 0);
});
