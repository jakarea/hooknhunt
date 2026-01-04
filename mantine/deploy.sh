#!/bin/bash

# Quick deployment script for probesh.hooknhunt.com
# Usage: ./deploy.sh [server-user] [server-host]

SERVER_USER=${1:-your-user}
SERVER_HOST=${2:-probesh.hooknhunt.com}
DIST_DIR="./dist"
REMOTE_PATH="/var/www/html"  # Adjust if your path is different

echo "🚀 Deploying to $SERVER_HOST..."
echo ""

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Error: $DIST_DIR directory not found!"
    echo "   Run 'npm run build' first."
    exit 1
fi

echo "📦 Files to upload:"
echo ""
ls -lh $DIST_DIR/
echo ""
echo "📦 Assets:"
ls -lh $DIST_DIR/assets/
echo ""

# Prompt user to continue
read -p "Continue deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "📤 Uploading files..."

# Upload using rsync (recommended)
rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    $DIST_DIR/ \
    $SERVER_USER@$SERVER_HOST:$REMOTE_PATH/

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Clear browser cache (Ctrl+Shift+R)"
    echo "2. Visit https://probesh.hooknhunt.com"
    echo "3. Check browser console for errors"
    echo ""
else
    echo ""
    echo "❌ Deployment failed!"
    echo "   Check your SSH credentials and server path."
    exit 1
fi
