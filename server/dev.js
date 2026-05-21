import { spawn } from 'node:child_process';

const api = spawn(process.execPath, ['server/index.js'], {
  stdio: 'inherit',
});

const web = spawn('npm', ['run', 'dev:web'], {
  stdio: 'inherit',
});

function stop() {
  api.kill('SIGTERM');
  web.kill('SIGTERM');
}

process.on('SIGINT', () => {
  stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stop();
  process.exit(0);
});

api.on('exit', (code) => {
  if (code && code !== 0) {
    web.kill('SIGTERM');
    process.exit(code);
  }
});

web.on('exit', (code) => {
  api.kill('SIGTERM');
  process.exit(code ?? 0);
});
