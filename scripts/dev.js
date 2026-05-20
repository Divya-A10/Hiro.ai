import { spawn } from 'child_process';

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

const child = spawn('npx', ['vite', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
