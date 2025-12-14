#!/bin/bash

# Script to push to both repositories at once

echo "🚀 Pushing to both repositories..."

# Push to origin (first repo)
echo "📤 Pushing to origin (moutazmohamed6666/gi-management-system-frontEnd)..."
git push origin main

# Push to backup (second repo)
echo "📤 Pushing to backup (OmarShahiin/gi-realstate-management-system)..."
git push backup main

echo "✅ Successfully pushed to both repositories!"

