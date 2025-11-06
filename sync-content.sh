#!/bin/bash

echo "=== Obsidian Content Sync ==="
echo

# Function to sync content from Obsidian vault to Astro content directory
sync_content() {
    local source_dir="src/astro-blog/content"
    local dest_dir="src/content"

    echo "Syncing content from $source_dir/ to $dest_dir/..."

    # Sync posts
    if [ -d "$source_dir/posts" ]; then
        echo "Syncing posts..."
        mkdir -p "$dest_dir/posts"
        # Copy only .md files and directories, excluding hidden directories like .obsidian
        find "$source_dir/posts" -maxdepth 1 -type f -name "*.md" -exec cp {} "$dest_dir/posts/" \; 2>/dev/null || true
    fi

    # Sync howtos
    if [ -d "$source_dir/howtos" ]; then
        echo "Syncing howtos..."
        mkdir -p "$dest_dir/howtos"
        # Copy only .md files and directories, excluding hidden directories like .obsidian
        find "$source_dir/howtos" -maxdepth 1 -type f -name "*.md" -exec cp {} "$dest_dir/howtos/" \; 2>/dev/null || true
    fi

    # Sync assets
    if [ -d "$source_dir/assets" ]; then
        echo "Syncing assets..."
        mkdir -p "$dest_dir/assets"
        cp -r "$source_dir/assets/"* "$dest_dir/assets/" 2>/dev/null || true
    fi

    echo "✅ Content sync completed"
}

# Function to check if content is in sync
check_sync() {
    local source_dir="src/astro-blog/content"
    local dest_dir="src/content"

    echo "Checking content synchronization..."

    local obsidian_posts=$(find "$source_dir/posts" -name "*.md" 2>/dev/null | wc -l)
    local astro_posts=$(find "$dest_dir/posts" -name "*.md" 2>/dev/null | wc -l)
    local obsidian_howtos=$(find "$source_dir/howtos" -name "*.md" 2>/dev/null | wc -l)
    local astro_howtos=$(find "$dest_dir/howtos" -name "*.md" 2>/dev/null | wc -l)

    echo "Obsidian: $obsidian_posts posts, $obsidian_howtos howtos"
    echo "Astro: $astro_posts posts, $astro_howtos howtos"

    if [ "$obsidian_posts" -eq "$astro_posts" ] && [ "$obsidian_howtos" -eq "$astro_howtos" ]; then
        echo "✅ Content is synchronized"
        return 0
    else
        echo "❌ Content is out of sync"
        return 1
    fi
}

# Main logic
case "${1:-sync}" in
    "sync")
        sync_content
        ;;
    "check")
        check_sync
        ;;
    "watch")
        echo "Watching for changes in Obsidian vault..."
        echo "Press Ctrl+C to stop"
        while true; do
            if ! check_sync >/dev/null 2>&1; then
                echo "$(date): Content out of sync, syncing..."
                sync_content
            fi
            sleep 5
        done
        ;;
    *)
        echo "Usage: $0 [sync|check|watch]"
        echo "  sync  - Copy content from Obsidian to Astro (default)"
        echo "  check - Check if content is synchronized"
        echo "  watch - Watch for changes and auto-sync every 5 seconds"
        exit 1
        ;;
esac