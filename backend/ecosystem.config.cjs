module.exports = {
  apps: [{
    name: 'ftu-bot-backend',
    script: 'server.js',
    cwd: '/root/FTU-bot/backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      GEMINI_API_KEY: 'AIzaSyAM5soPhqswXk-SCIplyM7eW5P88uLhXVA'
    },
    error_file: '/root/.pm2/logs/ftu-bot-backend-error.log',
    out_file: '/root/.pm2/logs/ftu-bot-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M'
  }]
};

