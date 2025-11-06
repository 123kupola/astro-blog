#!/bin/bash

# Script to create a new blog post with proper frontmatter

if [ $# -eq 0 ]; then
    echo "Usage: $0 \"Post Title\" [description]"
    echo "Example: $0 \"My Awesome Post\" \"This is a great post about tech\""
    exit 1
fi

TITLE="$1"
DESCRIPTION="${2:-}"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
DATE=$(date +%Y-%m-%d)
FILENAME="src/astro-blog/content/posts/${SLUG}.md"

if [ -f "$FILENAME" ]; then
    echo "Error: Post already exists: $FILENAME"
    exit 1
fi

cat > "$FILENAME" << EOF
---
title: "$TITLE"
description: "$DESCRIPTION"
date: "$DATE"
author: "Your Name"
published: false
featured: false
tags: []
---

# $TITLE

Write your post content here...

EOF

echo "Created new post: $FILENAME"
echo "Edit the file and set published: true when ready"
echo "Then run: ./sync-content.sh"