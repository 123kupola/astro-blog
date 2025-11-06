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
    // If not logged in and not on login page, redirect to login
    if (!isAuthed && context.url.pathname !== '/admin') {
      return new Response(null, { status: 302, headers: { Location: '/admin' } });
    }

    // If logged in and on login page, redirect to dashboard
    if (isAuthed && context.url.pathname === '/admin') {
      return new Response(null, { status: 302, headers: { Location: '/admin/dashboard' } });
    }
  }

  return next();
});