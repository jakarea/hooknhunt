#!/bin/bash

echo "=== Checking Your Attendance Status ==="
echo ""
echo "Run this command in your terminal:"
echo ""
echo "curl -X GET http://localhost:8000/api/v2/hrm/attendance/my-status \\"
echo "  -H \"Authorization: Bearer YOUR_TOKEN\" \\"
echo "  -H \"Accept: application/json\" | jq"
echo ""
echo "Or visit the dashboard and open browser console (F12)"
echo "Then run: fetch('/api/v2/hrm/attendance/my-status', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}}).then(r=>r.json()).then(console.log)"
