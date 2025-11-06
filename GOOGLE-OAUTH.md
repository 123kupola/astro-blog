# Google OAuth Setup for Local Development

## Can I Use Google OAuth Locally?

Yes, you can absolutely set up Google OAuth for local development in Docker! The OAuth flow works perfectly in development environments.

## Google Cloud Console Configuration

### 1. Create Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable the Google+ API (for OAuth)

### 2. Create OAuth 2.0 Credentials
- Navigate to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client IDs"
- Configure OAuth consent screen if prompted
- Select "Web application" as application type

### 3. Authorized Redirect URIs
For Docker development, add these redirect URIs:
```
http://localhost:4321/api/auth/callback/google
http://127.0.0.1:4321/api/auth/callback/google
```

## Local Development Setup

### Environment Variables
Create a `.env` file in your project root (add to `.gitignore`):

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Better Auth Configuration
BETTER_AUTH_SECRET=your_random_secret_here
BETTER_AUTH_URL=http://localhost:4321
```

### Docker Configuration
Your current Docker setup works fine:
- **Port mapping**: OAuth redirects work with localhost ports
- **Network**: Localhost redirects function within Docker containers
- **Environment**: Variables loaded from `.env` file

## OAuth Flow in Development

1. User clicks "Sign in with Google" → Redirects to Google OAuth
2. Google authenticates user → Redirects back to `http://localhost:4321/api/auth/callback/google`
3. Better Auth processes callback → Creates user session
4. User redirected to admin dashboard

## Testing OAuth Locally

- OAuth works immediately once credentials are configured
- No need for site to be publicly accessible
- Test both success and error scenarios
- Use browser developer tools to inspect redirects

## Production Migration

When deploying to production:
- Update Google Console with production domain URIs
- Change `BETTER_AUTH_URL` to live domain
- Ensure HTTPS is properly configured
- Update redirect URIs to use `https://yourdomain.com`

## Troubleshooting

### Common Issues:
- **Redirect URI mismatch**: Ensure exact URI match in Google Console
- **Port conflicts**: Verify Docker port mapping (default: 4321)
- **Environment variables**: Check `.env` file is loaded correctly
- **HTTPS requirement**: Google OAuth requires HTTPS in production

### Debug Steps:
1. Check browser network tab for redirect flows
2. Verify environment variables are loaded
3. Confirm Google Console redirect URIs match exactly
4. Test with different browsers

## Security Notes

- Never commit `.env` file to version control
- Use different OAuth credentials for development/production
- Regularly rotate secrets and API keys
- Monitor OAuth usage in Google Cloud Console

---

**Key Takeaway**: Google OAuth works seamlessly in local Docker development. The OAuth flow is independent of public accessibility - it only requires properly configured redirect URIs pointing to your local development server.</content>
<parameter name="filePath">GOOGLE-OAUTH.md