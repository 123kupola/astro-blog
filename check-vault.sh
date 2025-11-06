#!/bin/bash

echo "=== Obsidian Vault Sync Check ==="
echo

# Check if both directories exist
if [ -d "src/astro-blog" ]; then
    echo "✅ Obsidian vault exists: src/astro-blog/"
else
    echo "❌ Obsidian vault missing: src/astro-blog/"
    exit 1
fi

if [ -d "src/content" ]; then
    echo "✅ Astro content exists: src/content/"
else
    echo "❌ Astro content missing: src/content/"
    exit 1
fi

# Check if assets folders exist
if [ -d "src/astro-blog/content/assets" ]; then
    echo "✅ Obsidian assets folder exists: src/astro-blog/content/assets/"
else
    echo "❌ Obsidian assets folder missing: src/astro-blog/content/assets/"
    echo "   Run: mkdir -p src/astro-blog/content/assets"
fi

if [ -d "src/content/assets" ]; then
    echo "✅ Astro assets folder exists: src/content/assets/"
else
    echo "❌ Astro assets folder missing: src/content/assets/"
    echo "   Run: mkdir -p src/content/assets"
fi

# Check if .obsidian symlink exists in vault
if [ -L "src/astro-blog/.obsidian" ]; then
    echo "✅ Obsidian symlink exists: src/astro-blog/.obsidian -> $(readlink src/astro-blog/.obsidian)"
else
    echo "❌ Obsidian symlink missing: src/astro-blog/.obsidian"
    echo "   Run: ln -s ../.obsidian-vault src/astro-blog/.obsidian"
    exit 1
fi

# Check if .obsidian-vault exists
if [ -d ".obsidian-vault" ]; then
    echo "✅ Obsidian config exists: .obsidian-vault/"
else
    echo "❌ Obsidian config missing: .obsidian-vault/"
    exit 1
fi

# Check content in both locations
OBSIDIAN_POSTS=$(find src/astro-blog/content/posts -name "*.md" 2>/dev/null | wc -l)
OBSIDIAN_HOWTOS=$(find src/astro-blog/content/howtos -name "*.md" 2>/dev/null | wc -l)
ASTRO_POSTS=$(find src/content/posts -name "*.md" 2>/dev/null | wc -l)
ASTRO_HOWTOS=$(find src/content/howtos -name "*.md" 2>/dev/null | wc -l)

echo "✅ Obsidian content: $OBSIDIAN_POSTS posts, $OBSIDIAN_HOWTOS howtos"
echo "✅ Astro content: $ASTRO_POSTS posts, $ASTRO_HOWTOS howtos"

echo "✅ Content found: $POSTS_COUNT blog posts, $HOWTOS_COUNT how-to guides"
echo
echo "=== Ready to write in Obsidian! ==="
echo "Vault location: $(pwd)/src/astro-blog/"
echo "Note: Remember to sync new content to src/content/ for Astro"