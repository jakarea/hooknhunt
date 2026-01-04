#!/bin/bash
# Script to restore .htaccess after build
# Run this after: npm run build

cp .htaccess.dist dist/.htaccess
chmod 644 dist/.htaccess
chmod 644 dist/quotes.json
echo "✓ .htaccess restored to dist/"
echo "✓ Permissions fixed for web server"
