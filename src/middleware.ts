import { defineMiddleware } from 'astro:middleware';
import { auth } from '../auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api
    .getSession({
      headers: context.request.headers,
    });

  if (isAuthed) {
    context.locals.user = isAuthed.user;
    context.locals.session = isAuthed.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  // Check if accessing admin routes
  if (context.url.pathname.startsWith('/admin')) {
    // TEMPORARY: Allow admin access without authentication for testing
    const bypassAuth = true; // Set to false to re-enable OAuth requirement

    if (bypassAuth) {
      // Create a mock user for testing
      context.locals.user = {
        id: 'test-user',
        name: 'Test Admin',
        email: 'admin@test.com',
        image: null,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      context.locals.session = {
        id: 'test-session',
        userId: 'test-user',
        token: 'test-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // If on login page, redirect to dashboard
      if (context.url.pathname === '/admin') {
        return new Response(null, { status: 302, headers: { Location: '/admin/dashboard' } });
      }
    } else {
      // Original OAuth logic
      // If not logged in and not on login page, redirect to login
      if (!isAuthed && context.url.pathname !== '/admin') {
        return new Response(null, { status: 302, headers: { Location: '/admin' } });
      }

      // If logged in and on login page, redirect to dashboard
      if (isAuthed && context.url.pathname === '/admin') {
        return new Response(null, { status: 302, headers: { Location: '/admin/dashboard' } });
      }
    }
  }

  return next();
});