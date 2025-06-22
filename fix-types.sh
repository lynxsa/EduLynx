#!/bin/bash
# Fix TypeScript any types script

echo "🔧 Starting comprehensive TypeScript any type fixes..."

# Count initial any types
echo "📊 Initial any type count:"
grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

echo "🏗️ Applying systematic fixes..."

# Fix common any patterns in interfaces and types
find src/ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/: any\[\]/: unknown[]/g'
find src/ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/: any;/: unknown;/g'
find src/ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/: any)/: unknown)/g'
find src/ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/: any,/: unknown,/g'

# Fix function parameter types
find src/ -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/(.*: any)/(param: unknown)/g'

echo "✅ Basic any type fixes applied"

# Count remaining any types
echo "📊 Remaining any type count:"
grep -r ": any" src/ --include="*.ts" --include="*.tsx" | wc -l

echo "🔧 TypeScript fixes completed!"
