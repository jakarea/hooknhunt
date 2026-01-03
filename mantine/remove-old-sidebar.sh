#!/bin/bash

# Remove old shadcn sidebar imports and usage from all page files

find src/app -name "*.tsx" -type f -exec sed -i '' '/import.*AppSidebar.*from.*@\/components\/app-sidebar/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/import.*SiteHeader.*from.*@\/components\/site-header/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/import.*{.*SidebarInset/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/import.*SidebarProvider/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/SidebarInset,/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/SidebarProvider/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/<AppSidebar.*\/>/d' {} \;
find src/app -name "*.tsx" -type f -exec sed -i '' '/<SiteHeader.*\/>/d' {} \;

echo "Old sidebar code removed from all pages"
