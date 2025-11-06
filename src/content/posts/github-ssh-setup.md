---
title: SSH Key Setup Guide for GitHub
description: Complete guide to setting up SSH key authentication for GitHub repositories
date: 2025-11-04
author: Tech Team
published: false
featured: false
tags: ["github", "ssh", "git", "authentication", "security"]
---

# SSH Key Setup Guide for GitHub

This guide will help you set up SSH key authentication for GitHub.

## Step 1: Generate SSH Key Pair

Run the following command to generate a new SSH key pair:

```bash
ssh-keygen -t ed25519 -C "123kupola@gmail.com"
```

When prompted:
- **Enter file in which to save the key**: Press Enter to accept the default location (`~/.ssh/id_ed25519`)
- **Enter passphrase**: Choose a secure passphrase (recommended) or press Enter for no passphrase

## Step 2: Add SSH Key to SSH Agent

Start the SSH agent:

```bash
eval "$(ssh-agent -s)"
```

Add your SSH key to the agent:

```bash
ssh-add ~/.ssh/id_ed25519
```

## Step 3: Add SSH Key to GitHub

1. **Copy your public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. **Go to GitHub:**
   - Visit https://github.com/settings/keys
   - Click "New SSH key"

3. **Add the key:**
   - Give it a descriptive title (like "My Development Machine")
   - Paste your public key into the "Key" field
   - Click "Add SSH key"

## Step 4: Test SSH Connection

Test your SSH connection to GitHub:

```bash
ssh -T git@github.com
```

You should see a message like:
```
Hi 123kupola! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 5: Configure Git to Use SSH

By default, Git might try to use HTTPS. Configure it to use SSH:

```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

## Step 6: Create GitHub Repository

1. **Create repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `ai-automator`
   - Description: "AI Automator - AI-powered website generator using OpenRouter and LangChain"
   - Make it Public or Private as preferred
   - **Don't** initialize with README (we already have one)

2. **Add the remote and push:**
   ```bash
   git remote add origin git@github.com:123kupola/ai-automator.git
   git branch -M main
   git push -u origin main
   ```

## Troubleshooting

If you encounter issues:
- Ensure your SSH key is added to both the SSH agent and GitHub
- Check that your SSH key filename matches what you're adding to the agent
- Verify your GitHub email matches the one used in the SSH key

## Security Notes

- Never share your private key (`~/.ssh/id_ed25519`)
- Always use a passphrase for your SSH keys when possible
- Remove old/unused SSH keys from your GitHub settings regularly