#!/bin/bash

echo "=== Deployment Diagnostic Script for Hook & Hunt ==="
echo ""
echo "Checking local build files..."
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ folder does not exist!"
    echo "Run: npm run build"
    exit 1
fi

echo "✅ dist/ folder exists"

# Check for critical files
echo ""
echo "Checking critical files..."
files=(
    "dist/.htaccess"
    "dist/index.html"
    "dist/assets/index-G982CtGF.js"
    "dist/assets/index-BopuL_0p.css"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file is missing!"
    fi
done

# Check file permissions
echo ""
echo "Checking file permissions..."
echo "dist/.htaccess: $(ls -l dist/.htaccess | awk '{print $1}')"
echo "dist/index.html: $(ls -l dist/index.html | awk '{print $1}')"

# Show .htaccess content
echo ""
echo "=== dist/.htaccess content ==="
cat dist/.htaccess
echo ""
echo "=== End of .htaccess ==="

echo ""
echo "=== Server Testing Instructions ==="
echo ""
echo "Test if files exist on server:"
echo "  curl -I https://probesh.hooknhunt.com/.htaccess"
echo "  curl -I https://probesh.hooknhunt.com/assets/index-G982CtGF.js"
echo "  curl -I https://probesh.hooknhunt.com/assets/index-BopuL_0p.css"
echo ""
echo "Expected response headers:"
echo "  HTTP/2 200"
echo "  content-type: application/javascript (for .js files)"
echo "  content-type: text/css (for .css files)"
echo ""
echo "If you see 'content-type: text/html', the server is not configured correctly."
echo ""
