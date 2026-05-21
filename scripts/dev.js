import { spawn, execSync } from 'child_process';
import fs from 'fs';

const args = process.argv.slice(2);
console.log('Original dev args:', args);

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

console.log('Filtered dev args:', filteredArgs);

// Install Python dependencies
console.log('Installing Python dependencies from requirements.txt...');
try {
  const pipStdout = execSync('python3 -m pip install -r requirements.txt', { stdio: 'pipe' });
  fs.writeFileSync('./pip_install_logs.txt', `python3 -m pip success:\n${pipStdout.toString()}\n`);
  console.log('Python dependencies installed successfully.');
} catch (e) {
  console.warn('python3 -m pip failed, trying python...', e);
  fs.writeFileSync('./pip_install_logs.txt', `python3 -m pip failed: ${e.message}\nStderr: ${e.stderr ? e.stderr.toString() : ''}\n`);
  try {
    const pipStdout = execSync('python -m pip install -r requirements.txt', { stdio: 'pipe' });
    fs.appendFileSync('./pip_install_logs.txt', `\npython -m pip success:\n${pipStdout.toString()}\n`);
    console.log('Python dependencies installed successfully via python -m pip.');
  } catch (err) {
    console.error('Failed to install python dependencies:', err);
    fs.appendFileSync('./pip_install_logs.txt', `\npython -m pip failed: ${err.message}\nStderr: ${err.stderr ? err.stderr.toString() : ''}\n`);
  }
}

// Background spawn dynamic Express Node backend (server.ts) on port 5000 using npx tsx
console.log('Spawning Node Express backend (npx tsx server.ts on port 5000)...');
const devBackendProcess = spawn('npx', ['tsx', 'server.ts'], {
  env: { ...process.env, BACKEND_PORT: '5000' },
  shell: true
});

devBackendProcess.stdout.on('data', (data) => {
  console.log(`[Backend-Stdout] ${data.toString().trim()}`);
});
devBackendProcess.stderr.on('data', (data) => {
  console.error(`[Backend-Stderr] ${data.toString().trim()}`);
});

devBackendProcess.on('error', (err) => {
  console.error('Failed to start Node Express backend:', err);
});

const child = spawn('npx', ['vite', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  try {
    devBackendProcess.kill();
  } catch (e) {}
  process.exit(code || 0);
});
