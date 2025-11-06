import { defineMiddleware } from 'astro:middleware';
import { auth, assignFirstUserAdminRole, getUserRole } from '../auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api
    .getSession({
      headers: context.request.headers,
    });

  if (isAuthed) {
    // Check if user has a role assigned, if not, assign one
    let userRole = getUserRole(isAuthed.user.id);
    if (userRole === 'user') {
      // Try to assign admin role if this is the first user
      assignFirstUserAdminRole(isAuthed.user.id);
      // Re-check role after potential assignment
      userRole = getUserRole(isAuthed.user.id);
    }

    // Add role to user object
    context.locals.user = {
      ...isAuthed.user,
      role: userRole
    } as any;
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

    // Check if user has admin role for admin routes
    if (isAuthed && context.url.pathname !== '/admin') {
      const userRole = (context.locals.user as any)?.role;
      if (userRole !== 'admin') {
        return new Response('Access Denied: Admin privileges required', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  }

  return next();
});