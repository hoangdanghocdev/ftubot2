#!/bin/bash

# FTU-bot Deployment Script
# This script builds and deploys the FTU-bot application

set -e  # Exit on error

echo "🚀 Starting FTU-bot deployment..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Switch to Node 20
nvm use 20

# Navigate to project directory
cd /root/FTU-bot

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building production version..."
npm run build

# Copy logo folder to dist (for static assets)
echo "📁 Copying logo assets..."
cp -r logo dist/ 2>/dev/null || true

# Deploy to web directory
echo "📤 Deploying to web directory..."
mkdir -p /var/www/ftu.fyi
cp -r dist/* /var/www/ftu.fyi/
chown -R www-data:www-data /var/www/ftu.fyi
chmod -R 755 /var/www/ftu.fyi

# Test nginx configuration
echo "✅ Testing nginx configuration..."
nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
systemctl reload nginx

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://ftu.fyi"
echo ""
echo "📝 To set up SSL certificate, run:"
echo "   certbot --nginx -d ftu.fyi -d www.ftu.fyi --non-interactive --agree-tos --email YOUR_EMAIL --redirect"

