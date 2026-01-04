#!/bin/bash

echo "=== Deployment Verification for Hook & Hunt ==="
echo ""
echo "Testing server at: https://probesh.hooknhunt.com"
echo ""

# Array of files to check
declare -A files=(
    ["/"]="text/html"
    ["/assets/index-G982CtGF.js"]="application/javascript"
    ["/assets/index-BopuL_0p.css"]="text/css"
    ["/.htaccess"]="Should be 403 or 404 (hidden file)"
)

all_good=true

for file in "${!files[@]}"; do
    expected="${files[$file]}"
    echo "Checking: $file"

    # Get HTTP status and content type
    response=$(curl -s -I "https://probesh.hooknhunt.com$file" 2>&1)
    http_status=$(echo "$response" | grep -i "^HTTP" | awk '{print $2}')
    content_type=$(echo "$response" | grep -i "^content-type" | head -1 | cut -d':' -f2 | xargs)
    content_length=$(echo "$response" | grep -i "^content-length" | cut -d':' -f2 | xargs)

    echo "  Status: $http_status"
    echo "  Type: $content_type"
    echo "  Length: $content_length bytes"
    echo "  Expected: $expected"

    # Check if response matches expectation
    if [[ "$file" == *".js" ]]; then
        if [[ "$content_type" == *"application/javascript"* ]] || [[ "$content_type" == *"text/javascript"* ]]; then
            if [[ "$content_length" -gt 100000 ]]; then
                echo "  ✅ PASS"
            else
                echo "  ❌ FAIL - File too small (should be ~947KB)"
                all_good=false
            fi
        else
            echo "  ❌ FAIL - Wrong MIME type"
            all_good=false
        fi
    elif [[ "$file" == *".css" ]]; then
        if [[ "$content_type" == *"text/css"* ]]; then
            if [[ "$content_length" -gt 100000 ]]; then
                echo "  ✅ PASS"
            else
                echo "  ❌ FAIL - File too small (should be ~216KB)"
                all_good=false
            fi
        else
            echo "  ❌ FAIL - Wrong MIME type"
            all_good=false
        fi
    fi
    echo ""
done

echo "=================="
if [ "$all_good" = true ]; then
    echo "✅ All checks passed!"
    echo ""
    echo "Your deployment is working correctly."
    echo "Clear your browser cache and reload the site."
else
    echo "❌ Some checks failed!"
    echo ""
    echo "Common issues:"
    echo "1. Files not uploaded - Upload the entire dist/ folder"
    echo "2. .htaccess not working - Check with hosting provider"
    echo "3. Wrong MIME types - Add MIME types via cPanel or server config"
    echo ""
    echo "See DEPLOY-NOW.md for detailed instructions."
fi

echo ""
echo "=================="
echo "Local build location:"
echo "  /Applications/MAMP/htdocs/hooknhunt/mantine/dist/"
echo ""
echo "Files that should be uploaded:"
ls -lh dist/ dist/assets/ 2>/dev/null | grep -v "^total" | grep -v "^d" | awk '{print "  " $9 " (" $5 ")"}'
