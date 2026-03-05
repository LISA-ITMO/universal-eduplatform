#!/usr/bin/env bash
set -euo pipefail

# Start server, static frontends and telegram bot in background and wait.
# This is a simple supervisor; for production consider using a proper process manager.

echo "Starting services..."

# Start Node server
if [ -f /app/server/dist/main.js ]; then
  echo "Starting Node server (server)..."
  node /app/server/dist/main.js &
  PID_SERVER=$!
else
  echo "Warning: server dist not found at /app/server/dist/main.js"
  PID_SERVER=0
fi

# Start web frontend (serve)
if [ -d /app/web ]; then
  echo "Starting web frontend on :8888"
  serve -s /app/web -l 8888 &
  PID_WEB=$!
else
  echo "Warning: web build not found at /app/web"
  PID_WEB=0
fi

# Start admin frontend (serve)
if [ -d /app/admin ]; then
  echo "Starting admin frontend on :9999"
  serve -s /app/admin -l 9999 &
  PID_ADMIN=$!
else
  echo "Warning: admin build not found at /app/admin"
  PID_ADMIN=0
fi

# Start Telegram bot
if [ -f /app/tgbot/uni_eduplatform_bot.py ]; then
  echo "Starting Telegram bot"
  python3 /app/tgbot/uni_eduplatform_bot.py &
  PID_BOT=$!
else
  echo "Warning: bot script not found at /app/tgbot/uni_eduplatform_bot.py"
  PID_BOT=0
fi

shutdown() {
  echo "Shutting down..."
  set +e
  if [ "$PID_BOT" != "0" ]; then kill -TERM "$PID_BOT" 2>/dev/null || true; fi
  if [ "$PID_ADMIN" != "0" ]; then kill -TERM "$PID_ADMIN" 2>/dev/null || true; fi
  if [ "$PID_WEB" != "0" ]; then kill -TERM "$PID_WEB" 2>/dev/null || true; fi
  if [ "$PID_SERVER" != "0" ]; then kill -TERM "$PID_SERVER" 2>/dev/null || true; fi
  wait
  exit 0
}

trap shutdown SIGINT SIGTERM

echo "All services started. Waiting..."

# Wait indefinitely while background processes run
while true; do
  # If any background process died, exit with non-zero to allow container restart
  if [ "$PID_SERVER" != "0" ] && ! kill -0 "$PID_SERVER" 2>/dev/null; then echo "Server exited"; exit 1; fi
  if [ "$PID_WEB" != "0" ] && ! kill -0 "$PID_WEB" 2>/dev/null; then echo "Web server exited"; exit 1; fi
  if [ "$PID_ADMIN" != "0" ] && ! kill -0 "$PID_ADMIN" 2>/dev/null; then echo "Admin server exited"; exit 1; fi
  if [ "$PID_BOT" != "0" ] && ! kill -0 "$PID_BOT" 2>/dev/null; then echo "Bot exited"; exit 1; fi
  sleep 5
done
