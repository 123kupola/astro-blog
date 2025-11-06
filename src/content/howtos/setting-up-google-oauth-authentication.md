---
title: 'Setting Up Google OAuth Authentication'
description: 'Complete guide to implementing Google OAuth authentication in your Astro application with Better Auth'
date: '2025-11-06'
author: 'Tech Team'
published: true
tags: ['authentication', 'oauth', 'google', 'security', 'astro', 'better-auth']
heroImage: '/images/google-oauth-setup.jpg'
---

# Setting Up Google OAuth Authentication

This guide walks you through implementing secure Google OAuth authentication in your Astro application using Better Auth. The setup provides enterprise-grade security with minimal configuration.

## 🎯 Prerequisites

- Google Cloud Console account
- Astro project with Node.js 18+
- Basic understanding of environment variables

## 📋 Step 1: Google Cloud Console Setup

### 1.1 Create OAuth Credentials

1. **Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)**
2. **Select your project** (or create a new one)
3. **Click "Create Credentials" → "OAuth 2.0 Client IDs"**
4. **Configure the OAuth consent screen** if prompted

### 1.2 Configure OAuth Client

Set the following values:

**Application type:** `Web application`

**Authorized JavaScript origins:**
```
http://localhost:4321
```

**Authorized redirect URIs:**
```
http://localhost:4321/api/auth/callback/google
```

### 1.3 Get Your Credentials

After creation, note down:
- **Client ID**: `your_google_client_id_here`
- **Client Secret**: `your_google_client_secret_here`

## 🔧 Step 2: Environment Configuration

### 2.1 Create Environment File

Create or update your `.env` file:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=your_random_secret_here
BETTER_AUTH_URL=http://localhost:4321

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2.2 Generate Secure Secret

Generate a cryptographically secure random string for `BETTER_AUTH_SECRET`:

```bash
# Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🛠️ Step 3: Install Dependencies

Install Better Auth and required packages:

```bash
npm install better-auth better-sqlite3
npm install -D @types/better-sqlite3
```

## ⚙️ Step 4: Configure Authentication

### 4.1 Create Auth Configuration

Create `auth.ts` in your project root:

```typescript
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./auth.db"),
  baseURL: import.meta.env.BETTER_AUTH_URL || "http://localhost:4321",
  secret: import.meta.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true, // Optional: keep for fallback
  },
  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID!,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### 4.2 Set Up API Route

Create `src/pages/api/auth/[...all].ts`:

```typescript
import { auth } from "../../../../auth";

export async function GET({ request }: { request: Request }) {
  return auth.handler(request);
}

export async function POST({ request }: { request: Request }) {
  return auth.handler(request);
}
```

## 🎨 Step 5: Frontend Integration

### 5.1 Create Auth Client

Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.BETTER_AUTH_URL || "http://localhost:4321",
});
```

### 5.2 Add Login Button

Update your login page (`src/pages/admin.astro`):

```astro
<script>
  import { authClient } from '../lib/auth-client';

  document.getElementById('google-login')?.addEventListener('click', async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/admin/dashboard',
      });
    } catch (error) {
      console.error('OAuth login failed:', error);
      alert('Login failed. Please try again.');
    }
  });
</script>
```

## 🔐 Step 6: Middleware Protection

Create `src/middleware.ts` for route protection:

```typescript
import { auth } from '../auth';

export async function onRequest({ request, locals, redirect }: any) {
  const isAuthed = await auth.api.getSession({
    headers: request.headers,
  });

  if (isAuthed) {
    locals.user = isAuthed.user;
    locals.session = isAuthed.session;
  }

  // Protect admin routes
  if (request.url.includes('/admin') && !isAuthed) {
    return redirect('/admin');
  }

  return;
}
```

## 🎭 Step 7: UI State Management

### 7.1 Check Auth Status

Add to your layout (`src/layouts/Layout.astro`):

```javascript
// Check login status and update nav
fetch('/api/auth/check')
  .then(response => response.json())
  .then(data => {
    const loginLink = document.getElementById('login-link');
    if (loginLink && data.loggedIn) {
      // Replace with logout button
      const logoutButton = document.createElement('button');
      logoutButton.textContent = 'Logout';
      logoutButton.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
      });
      loginLink.replaceWith(logoutButton);
    }
  });
```

### 7.2 Create Auth Check Endpoint

Create `src/pages/api/auth/check.ts`:

```typescript
import { auth } from "../../../../auth";

export async function GET({ request }: { request: Request }) {
  const session = await auth.api.getSession({ headers: request.headers });
  return new Response(
    JSON.stringify({
      loggedIn: !!session,
      user: session?.user || null,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
```

## 🚀 Step 8: Testing

### 8.1 Start Development Server

```bash
npm run dev
```

### 8.2 Test Authentication Flow

1. **Visit** `http://localhost:4321/admin`
2. **Click** "Continue with Google"
3. **Complete** Google OAuth flow
4. **Verify** dashboard access and user info display
5. **Test** logout functionality

### 8.3 Verify Logs

Check console for successful authentication:
```
POST /api/auth/sign-in/social 200
GET /api/auth/callback/google 302
GET /admin/dashboard 200
```

## 🔧 Step 9: Production Deployment

### 9.1 Update Redirect URIs

For production, update Google Cloud Console with your domain:

**Authorized JavaScript origins:**
```
https://yourdomain.com
```

**Authorized redirect URIs:**
```
https://yourdomain.com/api/auth/callback/google
```

### 9.2 Environment Variables

Ensure production environment has:
```bash
BETTER_AUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
```

## 🐛 Troubleshooting

### Common Issues

**"Invalid Redirect" Error:**
- Verify exact redirect URI in Google Cloud Console
- Ensure no extra spaces or characters

**"Client ID not found" Error:**
- Check environment variables are loaded
- Verify `.env` file is in project root

**Login Button Not Working:**
- Check browser console for JavaScript errors
- Verify auth client is properly imported

**Session Not Persisting:**
- Ensure database file has write permissions
- Check middleware is properly configured

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.com)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)

## ✅ Success Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth credentials configured
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Auth configuration created
- [ ] API routes set up
- [ ] Frontend integration complete
- [ ] Middleware protection active
- [ ] UI state management working
- [ ] Authentication flow tested
- [ ] Production deployment ready

Your Astro application now has secure, enterprise-grade Google OAuth authentication! 🎉