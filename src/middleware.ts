import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies }, next) => {
  // Check if accessing admin routes
  if (url.pathname.startsWith('/admin')) {
    const session = cookies.get('admin-session');

    // If not logged in and not on login page, redirect to login
    if (!session && url.pathname !== '/admin') {
      return new Response(null, { status: 302, headers: { Location: '/admin' } });
    }

    // If logged in and on login page, redirect to dashboard
    if (session && url.pathname === '/admin') {
      return new Response(null, { status: 302, headers: { Location: '/admin/dashboard' } });
    }
  }

  return next();
});